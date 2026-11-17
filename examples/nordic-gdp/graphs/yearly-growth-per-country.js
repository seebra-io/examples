// Yearly growth of GDP per capita, one row per country (small multiples)
const rows = data.filter(d => d.growth_pct != null);
return plot({
  marginLeft: 70,
  color: false,
  x: {label: "year", tickFormat: "d"},
  y: {label: "growth (%)", grid: true, ticks: 3},
  fy: {label: null},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(rows, {x: "year", y: "growth_pct", fy: "country", fill: d => d.growth_pct >= 0 ? "#34d399" : "#f87171",
      tip: true, title: d => `${d.country} ${d.year}: ${d.growth_pct > 0 ? "+" : ""}${d.growth_pct}% on ${d.year - 1}\n$${d3.format(",")(d.gdp)} per person`}),
  ],
});