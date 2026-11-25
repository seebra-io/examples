// Where each system's genes are active: for every gene whose RNA HPA calls
// specific to one or a few tissues (enriched, group enriched or enhanced),
// one count per tissue it is specific to, by system. Hover a cell for its
// genes. Genes active everywhere (low tissue specificity) are not here: they
// are the bar on the right.
const {genes = []} = data || {};
const rows = genes.flatMap((g) => g.enriched.map((e) => ({system: g.system, tissue: e.tissue, gene: g.gene, ntpm: e.ntpm})));
const cells = d3.rollups(rows, (v) => ({n: v.length, genes: v.sort((a, b) => b.ntpm - a.ntpm).map((r) => r.gene)}),
  (r) => r.system, (r) => r.tissue).flatMap(([system, ts]) => ts.map(([tissue, v]) => ({system, tissue, ...v})));
const tissueOrder = d3.groupSort(rows, (v) => -v.length, (r) => r.tissue);
const systemOrder = d3.groupSort(rows, (v) => -v.length, (r) => r.system);
const everywhere = d3.rollups(genes.filter((g) => !g.enriched.length), (v) => v.length, (g) => g.system)
  .map(([system, n]) => ({system, n}));

return plot({
  marginLeft: 170, marginBottom: 90, marginRight: 70,
  x: {domain: tissueOrder.concat(["(not specific)"]), label: null, tickRotate: -40},
  y: {domain: systemOrder.concat(everywhere.map((d) => d.system).filter((s) => !systemOrder.includes(s))), label: null},
  color: {type: "sqrt", scheme: "viridis", label: "organ-specific genes", legend: true},
  marks: [
    Plot.cell(cells, {x: "tissue", y: "system", fill: "n", inset: 0.5,
      title: (d) => `${d.system} in ${d.tissue}: ${d.n} gene${d.n > 1 ? "s" : ""}\n${d.genes.slice(0, 14).join(", ")}${d.genes.length > 14 ? " …" : ""}`,
      tip: true}),
    Plot.text(cells, {x: "tissue", y: "system", text: "n", fill: (d) => (d.n > 6 ? "black" : "white"), fontSize: 10}),
    // the genes active in most tissues, for scale
    Plot.cell(everywhere, {x: () => "(not specific)", y: "system", fill: "#27272a", inset: 0.5,
      title: (d) => `${d.system}: ${d.n} genes with low or no tissue specificity`, tip: true}),
    Plot.text(everywhere, {x: () => "(not specific)", y: "system", text: "n", fill: "#a1a1aa", fontSize: 10}),
  ],
});