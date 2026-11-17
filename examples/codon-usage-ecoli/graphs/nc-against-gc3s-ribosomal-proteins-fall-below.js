// Wright's Nc plot: each gene's effective number of codons (20 = one codon
// per amino acid, 61 = all used equally) against the G+C share at its
// synonymous third positions. The curve is what mutation bias alone would
// give (2 + s + 29 / (s² + (1 − s)²)). Notice: the regulators stay near
// the curve, so their codons follow the genome's mutation pressure; the
// ribosomal proteins fall far below it, so something else (selection for
// fast, accurate translation of the most-made proteins) picks their codons.
// Rings: short genes (under 100 synonymous codons), whose Nc is noisy and
// can hit the 61 ceiling by chance. Hover a gene; click it for UniProt.
const genes = Array.isArray(data) ? data : [];
const curve = d3.range(0, 1.0001, 0.01).map(s => ({s, nc: 2 + s + 29 / (s * s + (1 - s) ** 2)}));
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 20),
  x: {label: "GC3s: G+C at synonymous third positions →", domain: [0.2, 0.8], tickFormat: "%", grid: true},
  y: {label: "↑ effective number of codons, Nc", domain: [20, 62], grid: true},
  color: {domain: ["ribosomal protein", "transcription regulator"], range: ["#f97316", "#3b82f6"], legend: true},
  marks: [
    Plot.line(curve.filter(d => d.s >= 0.2 && d.s <= 0.8), {x: "s", y: "nc", stroke: "currentColor", strokeOpacity: 0.6, strokeDasharray: "4 3"}),
    Plot.text([{s: 0.5, nc: 61}], {x: "s", y: "nc", text: () => "mutation bias alone (Wright 1990)", dy: -6, fillOpacity: 0.7}),
    // genes with under 100 synonymous codons as rings: their Nc is noisy (Wright's F needs counts)
    Plot.dot(genes.filter(d => d.syn_codons < 100), {x: "gc3s", y: "nc", stroke: "gene_set", r: 4, href: "link", target: "_blank", tip: true,
      channels: {gene: "gene", "b-number": "b", "synonymous codons": "syn_codons", "expected Nc": "expected", "below expected": "below_expected", "Fop": "fop"}}),
    Plot.dot(genes.filter(d => d.syn_codons >= 100), {x: "gc3s", y: "nc", fill: "gene_set", r: 4, fillOpacity: 0.8, href: "link", target: "_blank", tip: true,
      channels: {gene: "gene", "b-number": "b", "synonymous codons": "syn_codons", "expected Nc": "expected", "below expected": "below_expected", "Fop": "fop"}}),
    Plot.text(genes.filter(d => d.below_expected > 22 || (d.gene_set === "ribosomal protein" && d.nc > 45)), {x: "gc3s", y: "nc", text: "gene", dx: 6, textAnchor: "start", fontSize: 10}),
  ],
});