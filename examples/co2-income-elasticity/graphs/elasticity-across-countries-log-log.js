// Across countries: CO2 per person against income per person, both on log scales.
// The slope of the least-squares line is the income elasticity: % more CO2 for 1% more income.
const rows = Array.isArray(data) ? data : [];
const r = rows[0] ?? {};
const line = [...rows].sort((a, b) => a.gdp_ppp - b.gdp_ppp);
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 40),
  x: {type: "log", label: "GDP per person (PPP, constant 2021 international $, log scale) →", grid: true, tickFormat: "~s"},
  y: {type: "log", label: "↑ CO₂ per person (t CO₂e, log scale)", grid: true},
  color: {legend: true},
  r: {range: [2, 14]},
  marks: [
    Plot.line(line, {x: "gdp_ppp", y: "fitted_t", stroke: "currentColor", strokeOpacity: 0.6, strokeWidth: 2}),
    Plot.dot(rows, {x: "gdp_ppp", y: "co2_t", fill: "region", r: "population", fillOpacity: 0.8, href: "link", target: "_blank", tip: true,
      channels: {country: "country", income: "income", "fitted (t)": "fitted_t", "× the fit": "times_the_fit", years: d => `CO₂ ${d.co2_year}, GDP ${d.gdp_year}`}}),
    Plot.text([`elasticity ${r.elasticity} (95% CI ${r.lo}–${r.hi}) · R² ${r.r2} · ${r.n} countries`], {frameAnchor: "top-left", dx: 4, dy: 4, fill: "currentColor"}),
  ],
  caption: "Notice: on log–log axes the cloud is nearly a straight line, so CO₂ grows roughly in proportion to income across countries (elasticity near 1). "
    + "Caveats: correlation, not a causal effect of getting richer: climate, energy mix, oil exports and what a country imports instead of making all sit in the residuals (hover '× the fit'; Ireland's GDP is swollen by multinationals' accounts). "
    + "Territorial emissions, latest year each; every country weighs the same in the fit, whatever its size (dots are sized by population); economies under a million people are left out (their inventories count bunker fuel at home); the interval assumes independent countries.",
});