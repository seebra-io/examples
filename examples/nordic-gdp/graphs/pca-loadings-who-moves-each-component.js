// Loadings: each country's weight in PC1 and PC2 (read these before naming a component)
const rows = data.flatMap(d => ["pc1", "pc2"].map(c => ({country: d.variable, component: c.toUpperCase(), weight: d[c]})));
return plot({
  marginLeft: 70,
  color: false,
  x: {label: "weight in the component (unit-length loading)", domain: [-1, 1], grid: true},
  y: {label: null},
  fx: {label: null},
  marks: [
    Plot.ruleX([0]),
    Plot.barX(rows, {y: "country", x: "weight", fx: "component", fill: d => d.weight >= 0 ? "#38bdf8" : "#f472b6",
      tip: true, title: d => `${d.country} in ${d.component}: ${d.weight.toFixed(2)}`}),
  ],
});