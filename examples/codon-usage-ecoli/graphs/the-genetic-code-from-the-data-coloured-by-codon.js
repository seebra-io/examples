// The genetic code, read off the data: 64 codons in the classic table
// (first base: row blocks, second base: columns, third base: rows within a
// block), each with the amino acid it stood opposite in UniProt's proteins.
// Colour: how much more (orange) or less (blue) the ribosomal proteins use
// the codon than the regulators do (RSCU difference). Notice that the bias
// is between synonyms: the same amino acid, a different codon (Arg AGA/AGG
// and CGA, Leu CUA, Ile AUA, Gly GGA are nearly absent in ribosomal genes).
// Hover a codon for its counts; click it for its amino acid on Wikipedia.
const [code, use] = [data[0] || [], data[1] || []];
const u = new Map(use.map(d => [d.codon, d]));
const B = ["T", "C", "A", "G"];
const rows = code.map(d => ({...d, ...(u.get(d.codon) || {}), aa: d.aa, row: d.b1 + d.b3,
  label: `${d.codon.replace(/T/g, "U")} ${d.aa === "*" ? "stop" : d.aa}`,
  link: d.aa === "*" ? "https://en.wikipedia.org/wiki/Stop_codon" : `https://en.wikipedia.org/wiki/DNA_and_RNA_codon_tables`}));
const tip = d => [`${d.codon.replace(/T/g, "U")} (DNA ${d.codon}) → ${d.aa === "*" ? "stop" : d.aa}`,
  `read opposite ${d.aa} in ${d.n} of ${d.total} places (agreement ${(d.agreement * 100).toFixed(1)}%)`,
  `degeneracy: ${d.degeneracy} codon${d.degeneracy > 1 ? "s" : ""} for this amino acid`,
  d.rscu_rp != null ? `RSCU ribosomal proteins ${d.rscu_rp} (n ${d.n_rp ?? 0}) · regulators ${d.rscu_tf} (n ${d.n_tf ?? 0})` : "stop codon: not in the RSCU",
  d.preferred ? "the ribosomal proteins' preferred codon" : null].filter(Boolean).join("\n");
const m = d3.max(rows, d => Math.abs(d.delta ?? 0)) || 1;
return plot({
  height: Math.max(460, (fit?.height ?? 520) - 30), marginLeft: 40, marginTop: 30,
  x: {domain: B, label: "second base", axis: "top", tickFormat: b => b.replace("T", "U")},
  y: {domain: B.flatMap(a => B.map(c => a + c)), label: "first base · third base", tickFormat: s => s.replace(/T/g, "U").split("").join(" · ")},
  color: {type: "diverging", domain: [-m, m], scheme: "rdbu", reverse: true, legend: true, label: "RSCU ribosomal proteins − regulators"},
  marks: [
    Plot.cell(rows, {x: "b2", y: "row", fill: d => d.delta ?? 0, inset: 1, rx: 3, href: "link", target: "_blank", title: tip, tip: true}),
    Plot.text(rows, {x: "b2", y: "row", text: "label", fontSize: 11, fontWeight: d => d.preferred ? "bold" : "normal"}),
  ],
  caption: "Bold: the codon each amino acid uses most in the ribosomal proteins. Codons as RNA (U for T). Start codons are left out of the counts.",
});