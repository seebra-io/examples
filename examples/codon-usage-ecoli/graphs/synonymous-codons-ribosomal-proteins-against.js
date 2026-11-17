// Synonymous codons side by side: per amino acid (rows of panels), each
// codon's RSCU in the regulators (blue) and in the ribosomal proteins
// (orange), joined by a line. RSCU 1 (grey rule) is no preference. The
// ribosomal proteins pull toward one codon per amino acid (e.g. Leu CTG,
// Arg CGT, Gly GGT) and away from the codons E. coli has few tRNAs for.
const rows = (Array.isArray(data) ? data : []).filter(d => d.degeneracy > 1);
const aas = [...new Set(rows.map(d => d.aa))].sort();
const tip = d => `${d.aa} ${d.codon}: RSCU ribosomal ${d.rscu_rp} (n ${d.n_rp}), regulators ${d.rscu_tf} (n ${d.n_tf}); Δ ${d.delta}${d.preferred ? " · preferred" : ""}`;
return plot({
  height: Math.max(700, rows.length * 13 + 60), marginLeft: 70,
  x: {label: "RSCU (1 = no preference) →", grid: true},
  y: {domain: aas.flatMap(a => rows.filter(d => d.aa === a).map(d => `${a} ${d.codon}`)), label: null},
  marks: [
    Plot.ruleX([1], {stroke: "currentColor", strokeOpacity: 0.3}),
    Plot.link(rows, {x1: "rscu_tf", x2: "rscu_rp", y1: d => `${d.aa} ${d.codon}`, y2: d => `${d.aa} ${d.codon}`, stroke: "currentColor", strokeOpacity: 0.3}),
    Plot.dot(rows, {x: "rscu_tf", y: d => `${d.aa} ${d.codon}`, fill: "#3b82f6", r: 3.5, title: tip, tip: true}),
    Plot.dot(rows, {x: "rscu_rp", y: d => `${d.aa} ${d.codon}`, fill: "#f97316", r: 3.5, title: tip, tip: true}),
  ],
  caption: "Blue: transcription regulators; orange: ribosomal proteins. One row per synonymous codon; Met, Trp and stops have no synonyms.",
});