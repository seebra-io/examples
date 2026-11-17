// The two numbers of each Gompertz line: the level at 60 (m(60), log
// scale) against the doubling time of the risk (MRDT = ln 2 / b, years).
// Arrows go from 2003 to 2023 for each country and sex. Notice: the level
// differs two- to threefold between countries and fell everywhere in
// twenty years, while the doubling time stays between 6.6 and 10 years; where the
// level is low, the slope is steeper (the Strehler–Mildvan correlation):
// countries postpone death without slowing the rate of ageing.
const rows = Array.isArray(data) ? data : [];
const pairs = d3.groups(rows, d => `${d.geo} ${d.sex}`).map(([k, v]) => {
  const a = v.find(d => d.year === 2003), b = v.find(d => d.year === 2023);
  return a && b ? {k, sex: a.sex, country: a.country, x1: a.mrdt, y1: a.m60, x2: b.mrdt, y2: b.m60} : null;
}).filter(Boolean);
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 20),
  x: {label: "mortality-rate doubling time, ln 2 / b (years) →", grid: true},
  y: {type: "log", label: "↑ death rate at 60 on the fitted line (log)", grid: true, tickFormat: "~g"},
  color: {domain: ["women", "men"], range: ["#e11d48", "#2563eb"], legend: true},
  symbol: {domain: [2003, 2023], range: ["circle", "triangle"], legend: true},
  marks: [
    Plot.arrow(pairs, {x1: "x1", y1: "y1", x2: "x2", y2: "y2", stroke: "sex", strokeOpacity: 0.45, headLength: 6}),
    Plot.dot(rows, {x: "mrdt", y: "m60", stroke: "sex", symbol: "year", r: 4, tip: true,
      channels: {country: "country", year: "year", "b (per year)": "b", "ln a": "ln_a", "R² (35–84)": "r2"}}),
    Plot.text(rows.filter(d => d.year === 2023), {x: "mrdt", y: "m60", text: "geo", dx: 7, textAnchor: "start", fontSize: 10, fill: "sex"}),
  ],
});