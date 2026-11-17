// Poisson counts: holidays per day worldwide against a steady random rate (dashed: the
// week's mean, lam). Hover a bar for P(at least this many) under Poisson. The dispersion
// index (variance / mean) is 1 for Poisson; well above 1, holidays cluster (shared feasts,
// weekends). Seven days is a tiny sample, so read the p-values loosely.
const d0 = data[0] ?? {};
return plot({
  x: {label: null, type: "band", tickFormat: (d) => d3.utcFormat("%a %e %b")(new Date(d))},
  y: {label: "public holidays that day (all countries)", grid: true},
  color: false,
  marks: [
    Plot.barY(data, {x: "date", y: "holidays", fill: (d) => d.p_at_least < 0.05 ? "#f97316" : "#60a5fa",
      channels: {nationwide: "nationwide", countries: "countries", "expected (lam)": "lam", "P(at least this many)": "p_at_least"}, tip: true}),
    Plot.ruleY([d0.lam], {stroke: "currentColor", strokeDasharray: "4,3"}),
    Plot.text([d0], {frameAnchor: "top-right", dy: 4, fill: "currentColor", fillOpacity: 0.75,
      text: (d) => `mean ${d.lam}/day · dispersion ${d.dispersion} (1 = Poisson) · p = ${d.p_overdispersed}`}),
    Plot.ruleY([0]),
  ],
});