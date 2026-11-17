// Correlation matrix of hourly log returns over the last 7 days (Pearson r)
const order = [...new Set(data.map(d => d.a))];
return plot({
  height: (fit?.height ?? 400) - 36,
  marginLeft: 50, marginBottom: 40,
  x: {label: null, domain: order, tickRotate: -45, tickFormat: s => s.toUpperCase()},
  y: {label: null, domain: order, tickFormat: s => s.toUpperCase()},
  color: {type: "diverging", domain: [-1, 1], scheme: "RdBu", label: "Pearson r of hourly log returns"},
  marks: [
    Plot.cell(data, {x: "a", y: "b", fill: "r",
      tip: true, title: d => `${d.a.toUpperCase()} and ${d.b.toUpperCase()}: r = ${d.r == null ? "n/a" : d.r.toFixed(2)}\nover ${d.hours} shared hours`}),
  ],
  caption: "Most coins move with Bitcoin: one market factor. A correlation is co-movement, not a cause, and one week of hours is a small, noisy sample; stablecoin cells are noise around a peg.",
});