// Does evolution agree with AlphaMissense? Every change one DNA letter can
// make, by how many of gnomAD's 807,162 people carry it, against its
// predicted pathogenicity. A change that breaks the protein is removed by
// selection before it can spread, so the commoner a change, the bluer it
// should be. Watch the "one person" column: in TP53 it is redder than
// "never seen", because gnomAD's blood samples include clonal
// haematopoiesis (blood cells that gained a TP53 mutation with age), not
// inherited variants. Hover a band for its counts.
const s = data || {};
const bands = (s.by_frequency || []).map((b) => b.band);
const rows = (s.variants || []);
const H = Math.max(380, (fit?.height ?? 520) - 50);
const n = Object.fromEntries((s.by_frequency || []).map((b) => [b.band, b.n]));
// bands with many changes as violins (25 bins, each band scaled to its own
// widest bin), the few as dots
const BINS = 25, bins = [];
for (const band of bands) {
  const xs = rows.filter((v) => v.band === band);
  if (xs.length < 20) continue;
  const c = new Array(BINS).fill(0);
  for (const v of xs) c[Math.min(BINS - 1, Math.floor(v.am * BINS))]++;
  const mx = Math.max(...c);
  c.forEach((k, i) => k && bins.push({band, y1: i / BINS, y2: (i + 1) / BINS, w: k / mx, k, share: k / xs.length, mid: (i + 0.5) / BINS}));
}
const few = rows.filter((v) => n[v.band] < 20);
return plot({
  height: H, marginLeft: 60, marginBottom: 40,
  fx: {domain: bands, label: null, tickFormat: (b) => `${b} (${n[b]})`, padding: 0.08},
  x: {axis: null, domain: [-1.05, 1.05]},
  y: {domain: [0, 1], label: "↑ AlphaMissense pathogenicity", grid: true},
  color: {type: "sequential", scheme: "RdYlBu", reverse: true, domain: [0, 1], legend: true, label: "AlphaMissense"},
  marks: [
    Plot.ruleY([0.34, 0.564], {stroke: "currentColor", strokeOpacity: 0.35, strokeDasharray: "4,3"}),
    Plot.rect(bins, {fx: "band", x1: (d) => -d.w, x2: "w", y1: "y1", y2: "y2", fill: "mid", inset: 0.5, tip: true,
      channels: {changes: "k", "share of band": (d) => `${(100 * d.share).toFixed(1)}%`, score: (d) => `${d.y1.toFixed(2)}–${d.y2.toFixed(2)}`}}),
    Plot.dot(few, Plot.dodgeX("middle", {fx: "band", y: "am", r: 3, fill: "am", stroke: "#09090b",
      href: "link", target: "_blank", tip: true,
      channels: {change: "change", gnomAD: (v) => `${v.ac} alleles of ${v.an.toLocaleString()}`, ClinVar: (v) => v.clinvar_text || "—"}})),
    Plot.ruleY(s.by_frequency || [], {fx: "band", y: "median_am", stroke: "currentColor", strokeWidth: 2.5}),
    Plot.text(s.by_frequency || [], {fx: "band", y: "median_am", x: 0, text: (b) => b.n ? `median ${b.median_am.toFixed(2)} · ${(100 * b.likely_pathogenic).toFixed(0)}% LP` : "",
      dy: -9, fontSize: 10, fontWeight: 600, fill: "currentColor", stroke: "#09090b", strokeWidth: 3}),
  ],
  caption: "Every protein change reachable by one DNA letter (AlphaMissense on GRCh38), joined to gnomAD v4 exomes and genomes by genomic variant. Width: how many changes score there, per band. Bar: the band's median; dashed: AlphaMissense's thresholds (0.34, 0.564). Hover a dot or bin; a dot opens the variant in gnomAD.",
});