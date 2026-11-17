// Spearman rank correlations between score, answers, views and age, as a matrix.
// +1: rank together, 0: no monotone relation, −1: opposite. Not a cause: age drives
// views, answers and score alike, and the "hot" list was picked on those same numbers.
const rows = Array.isArray(data) ? data : [];
const vars = rows.map(d => d.variable);
const cells = rows.flatMap(r => vars.map(v => ({row: r.variable, col: v, rho: r[v]})));
return plot({
  marginLeft: 80,
  aspectRatio: 1,
  x: {domain: vars, label: null, axis: "top"},
  y: {domain: vars, label: null},
  color: {type: "linear", domain: [-1, 1], scheme: "RdBu", label: "Spearman ρ", legend: true},
  marks: [
    Plot.cell(cells, {x: "col", y: "row", fill: "rho", inset: 1, tip: {format: {fill: ".2f"}}}),
    Plot.text(cells, {x: "col", y: "row", text: d => d.rho == null ? "–" : d.rho.toFixed(2),
      fill: d => Math.abs(d.rho) > 0.6 ? "white" : "black"}),
  ],
});