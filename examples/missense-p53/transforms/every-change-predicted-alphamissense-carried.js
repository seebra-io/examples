// Every possible single amino-acid change in the protein, three ways:
// AlphaMissense's prediction (Cheng et al., Science 2023: 0 benign … 1
// pathogenic; ≥ 0.564 likely pathogenic, ≤ 0.34 likely benign), whether
// people carry it (gnomAD v4, 807,162 people) and what clinics concluded
// (ClinVar). Plus AlphaFold's confidence per residue (pLDDT), which is low
// where the chain has no fixed fold.
// data[0]: AlphaMissense, all 19 substitutions per residue (CSV text);
// data[1]: AlphaMissense on GRCh38, the substitutions one DNA letter can
// make, with their genomic variant (CSV text); data[2]: AlphaFold's pLDDT;
// data[3]: gnomAD's gene (variants and ClinVar, GraphQL); data[4]: the
// AlphaFold entry.
// Joined on the genomic variant (17-7674220-C-T), not on "p.Arg248Gln":
// gnomAD and ClinVar name protein changes on different transcripts.
(() => {
  const [amText, hgText, conf, gn, entry] = data;
  const csv = (t) => {
    const lines = String(t || "").trim().split(/\r?\n/);
    const head = lines.shift().split(",");
    return lines.map((l) => Object.fromEntries(l.split(",").map((v, i) => [head[i], v])));
  };
  const AA = "ACDEFGHIKLMNPQRSTVWY";
  const gene = gn?.data?.gene || {};
  const meta = (Array.isArray(entry) ? entry[0] : entry) || {};
  const seq = meta.uniprotSequence || meta.sequence || "";

  // residues: pLDDT and the 19 predictions
  const plddt = conf?.confidenceScore || [];
  const residues = [...seq].map((aa, i) => ({pos: i + 1, aa, plddt: plddt[i] ?? null, subs: {}, gnomad: 0, max_af: 0,
                                              clinvar_path: 0, clinvar_benign: 0, clinvar_vus: 0}));
  for (const r of csv(amText)) {
    const m = /^([A-Z])(\d+)([A-Z])$/.exec(r.protein_variant || "");
    if (!m || !residues[+m[2] - 1]) continue;
    residues[+m[2] - 1].subs[m[3]] = +r.am_pathogenicity;
  }
  for (const r of residues) {
    const v = Object.values(r.subs);
    r.am_mean = v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
    r.am_lp = v.length ? v.filter((x) => x >= 0.564).length / v.length : null;
  }

  // the substitutions one DNA letter can make, keyed by genomic variant
  const byVariant = new Map();
  const variants = new Map(); // protein change -> row
  for (const r of csv(hgText)) {
    const id = `${r.CHROM.replace(/^chr/, "")}-${r.POS}-${r.REF}-${r.ALT}`;
    const m = /^([A-Z])(\d+)([A-Z])$/.exec(r.protein_variant || "");
    if (!m) continue;
    let v = variants.get(r.protein_variant);
    if (!v) variants.set(r.protein_variant, v = {change: r.protein_variant, pos: +m[2], from: m[1], to: m[3],
      am: +r.am_pathogenicity, am_class: r.am_class.replace("_", " "), ac: 0, an: 0, af: 0, carriers: 0,
      clinvar: null, stars: 0, variant_ids: []});
    v.variant_ids.push(id);
    byVariant.set(id, v);
  }
  // gnomAD: allele counts, exomes and genomes together
  for (const g of gene.variants || []) {
    const v = byVariant.get(g.variant_id);
    if (!v) continue;
    const ac = (g.exome?.ac || 0) + (g.genome?.ac || 0), an = Math.max(g.exome?.an || 0, 0) + Math.max(g.genome?.an || 0, 0);
    if (!ac) continue;
    v.ac += ac; v.an = Math.max(v.an, an); v.af = v.an ? v.ac / v.an : 0;
  }
  // ClinVar: the best-reviewed classification of any of its genomic variants
  const sigClass = (s) => /conflicting/i.test(s) ? "conflicting" : /pathogenic/i.test(s) && !/benign/i.test(s) ? "pathogenic"
    : /benign/i.test(s) && !/pathogenic/i.test(s) ? "benign" : /uncertain/i.test(s) ? "uncertain" : "other";
  for (const c of gene.clinvar_variants || []) {
    const v = byVariant.get(c.variant_id);
    if (!v || (v.clinvar && v.stars >= (c.gold_stars || 0))) continue;
    v.clinvar = sigClass(c.clinical_significance || ""); v.clinvar_text = c.clinical_significance; v.stars = c.gold_stars || 0;
  }
  const rows = [...variants.values()].sort((a, b) => a.pos - b.pos || a.to.localeCompare(b.to));
  for (const v of rows) {
    const r = residues[v.pos - 1];
    v.plddt = r?.plddt ?? null;
    v.band = v.ac === 0 ? "never seen" : v.ac === 1 ? "one person" : v.af < 1e-4 ? "rare (< 1 in 10,000)" : v.af < 1e-2 ? "uncommon (< 1%)" : "common (≥ 1%)";
    v.link = `https://gnomad.broadinstitute.org/variant/${v.variant_ids[0]}?dataset=gnomad_r4`;
    if (!r) continue;
    if (v.ac) { r.gnomad++; r.max_af = Math.max(r.max_af, v.af); }
    if (v.clinvar === "pathogenic") r.clinvar_path++;
    if (v.clinvar === "benign") r.clinvar_benign++;
    if (v.clinvar === "uncertain") r.clinvar_vus++;
  }

  // summaries
  const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? (s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2 : null; };
  const BANDS = ["never seen", "one person", "rare (< 1 in 10,000)", "uncommon (< 1%)", "common (≥ 1%)"];
  const by_frequency = BANDS.map((band) => {
    const xs = rows.filter((v) => v.band === band).map((v) => v.am);
    return {band, n: xs.length, median_am: median(xs), likely_pathogenic: xs.length ? xs.filter((x) => x >= 0.564).length / xs.length : null};
  });
  // ClinVar against AlphaMissense: reviewed (≥ 1 star) pathogenic vs benign
  const P = rows.filter((v) => v.clinvar === "pathogenic" && v.stars >= 1).map((v) => v.am);
  const B = rows.filter((v) => v.clinvar === "benign" && v.stars >= 1).map((v) => v.am);
  let gt = 0; for (const p of P) for (const b of B) gt += p > b ? 1 : p === b ? 0.5 : 0;
  const auc = P.length && B.length ? gt / (P.length * B.length) : null;
  const calls = (xs) => ({lp: xs.filter((x) => x >= 0.564).length, amb: xs.filter((x) => x > 0.34 && x < 0.564).length, lb: xs.filter((x) => x <= 0.34).length});
  const vus = rows.filter((v) => v.clinvar === "uncertain").map((v) => v.am);
  const PLDDT = [["very low (< 50)", 0, 50], ["low (50–70)", 50, 70], ["confident (70–90)", 70, 90], ["very high (≥ 90)", 90, 101]];
  const by_confidence = PLDDT.map(([band, lo, hi]) => {
    const rs = residues.filter((r) => r.plddt != null && r.plddt >= lo && r.plddt < hi && r.am_mean != null);
    return {band, residues: rs.length, mean_am: rs.length ? rs.reduce((s, r) => s + r.am_mean, 0) / rs.length : null,
            likely_pathogenic: rs.length ? rs.reduce((s, r) => s + r.am_lp, 0) / rs.length : null,
            clinvar_pathogenic: rs.reduce((s, r) => s + r.clinvar_path, 0)};
  });
  return {
    gene: gene.symbol || meta.gene, uniprot: meta.uniprotAccession, protein: meta.uniprotDescription, length: seq.length,
    alphafold: {entry: meta.entryId, mean_plddt: +meta.globalMetricValue || null, url: `https://alphafold.ebi.ac.uk/entry/${meta.uniprotAccession}`},
    constraint: gene.gnomad_constraint || null,
    residues, variants: rows, by_frequency, by_confidence,
    clinvar: {pathogenic: P.length, benign: B.length, auc, pathogenic_calls: calls(P), benign_calls: calls(B), uncertain: vus.length, uncertain_calls: calls(vus)},
    reachable: rows.length, possible: residues.reduce((s, r) => s + Object.keys(r.subs).length, 0),
  };
})()