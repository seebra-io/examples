// Contact fingerprint: each residue within 5 Å of a ligand (rows) against the
// ligand (columns: caffeine's two modelled orientations in 5MZP, adenosine in
// 2YDO), coloured by the strongest contact kind, with the closest distance in
// Å. Rows: contacts both make first, then adenosine's only (its ribose:
// Ser277, His278, Thr88, ...), then caffeine's only; by residue number within
// each. Notice: caffeine keeps the purine contacts (Phe168 stacking, the
// Asn253 H-bond) and has nothing to offer the ribose pocket. Click a cell for
// UniProt's features of the receptor. Caveat: distance cutoffs, not energies;
// 5MZP carries Ala at 88 and 277 (thermostabilising mutations).
const [fp, cmp] = [data[0] || [], data[1] || []];
const order = { "both": 0, "adenosine only": 1, "caffeine only": 2 };
const rows = cmp.slice().sort((a, b) => order[a.share] - order[b.share] || a.seq - b.seq);
const name = r => `${r.label}${r.bw ? " · " + r.bw : ""}`;
const yOf = new Map(rows.map(r => [r.seq, name(r)]));
const row = new Map(rows.map(r => [r.seq, r]));
const kinds = ["H-bond", "π-stacking", "hydrophobic", "within 5 Å"];
const tip = d => {
  const r = row.get(d.seq) || {};
  return [`${d.label} (${d.entry}) · ${[d.segment, d.bw].filter(Boolean).join(" ") || "no generic number"}`,
    `${d.ligand}: ${d.kind}, closest ${d.d_min.toFixed(2)} Å (${d.closest}, ${d.part})`,
    d.polar_A != null ? `N/O pair ${d.polar_A.toFixed(2)} Å` : null,
    d.stack_A != null ? `ring centroids ${d.stack_A.toFixed(2)} Å` : null,
    d.cc_A != null ? `C–C ${d.cc_A.toFixed(2)} Å` : null,
    `${d.pairs} atom pairs within 5 Å`,
    d.uniprot, r.mutation ? `${r.mutation} here (wild type ${r.wt})` : null,
    "click: UniProt P29274"].filter(Boolean).join("\n");
};
return plot({
  marginLeft: 118, marginRight: 112, marginTop: 34,
  height: Math.max(300, rows.length * 22 + 70),
  x: { domain: ["caffeine A", "caffeine B", "adenosine"], axis: "top", label: null, tickFormat: d => d === "adenosine" ? "adenosine (2YDO)" : d.replace("caffeine", "caffeine (5MZP)") },
  y: { domain: rows.map(name), label: null },
  color: { domain: kinds, range: ["#38bdf8", "#f59e0b", "#84cc16", "#a1a1aa"], legend: true },
  marks: [
    Plot.cell(fp, { x: "ligand", y: d => yOf.get(d.seq), fill: "kind", inset: 1, rx: 3, href: "link", target: "_blank", title: tip, tip: true }),
    Plot.text(fp, { x: "ligand", y: d => yOf.get(d.seq), text: d => d.d_min.toFixed(1), fill: "#09090b", fontSize: 11 }),
    // the right margin: shared, or one ligand's only; a mutation where there is one
    ...[["both", "currentColor"], ["adenosine only", "#34d399"], ["caffeine only", "#a78bfa"]].map(([share, fill]) =>
      Plot.text(rows.filter(r => r.share === share), { y: name, frameAnchor: "right", dx: 8, textAnchor: "start", fill, fillOpacity: 0.85,
        text: r => r.share + (r.mutation ? " · " + r.mutation.replace(" has ", ": ") : "") })),
  ],
});
