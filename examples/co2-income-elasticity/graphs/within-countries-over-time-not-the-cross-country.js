// Within countries: each country's path through time (1990 → latest), on the same axes as the cross-section.
// data[0]: series {country, year, gdp_ppp, co2_t}; data[1]: within {country, elasticity, lo, hi, ...}; data[2]: the cross-section fit
const [series, within, cross] = data;
const line = [...(cross || [])].sort((a, b) => a.gdp_ppp - b.gdp_ppp);
const e = new Map(within.map(d => [d.country, d]));
const last = d3.groups(series, d => d.country).map(([c, v]) => v[v.length - 1]);
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 40),
  marginRight: 150,
  x: {type: "log", label: "GDP per person (PPP, constant 2021 int. $, log scale) →", grid: true, tickFormat: "~s"},
  y: {type: "log", label: "↑ CO₂ per person (t CO₂e, log scale)", grid: true},
  color: {legend: false, scheme: "tableau10"},
  marks: [
    Plot.dot(cross || [], {x: "gdp_ppp", y: "co2_t", r: 2, fill: "currentColor", fillOpacity: 0.12}),
    Plot.line(line, {x: "gdp_ppp", y: "fitted_t", stroke: "currentColor", strokeOpacity: 0.35, strokeDasharray: "4,3"}),
    Plot.line(series, {x: "gdp_ppp", y: "co2_t", z: "country", stroke: "country", strokeWidth: 2, markerEnd: "arrow"}),
    Plot.dot(series, {x: "gdp_ppp", y: "co2_t", fill: "country", r: 2, tip: true,
      title: d => `${d.country} ${d.year}: ${d3.format(",.0f")(d.gdp_ppp)} $ per person, ${d.co2_t.toFixed(1)} t CO₂e per person`}),
    Plot.text(last, {x: "gdp_ppp", y: "co2_t", fill: "country", dx: 8, textAnchor: "start",
      text: d => `${d.country}: ${e.get(d.country)?.elasticity ?? "?"} (${e.get(d.country)?.lo}…${e.get(d.country)?.hi})`}),
  ],
  caption: "Notice: the slope across countries (dashed) is not the path of any one country. Sweden, the UK, Germany and the US got richer while emitting less (negative elasticity over time), "
    + "China and India moved up the line. A between-country slope says little about what happens within a country: the ecological fallacy. "
    + "Caveat: within-country intervals assume independent years, which a trend violates, so they are too narrow.",
});