// Estimated diameters span about 5 m to over 1 km, so the bins are equal
// steps of the log (quarter decades). On such a skewed spread the median and
// the geometric mean say what is typical; the mean is pulled up by the few big ones.
const rows = Array.isArray(data) ? data : [];
const s = rows[0] ?? {};
const refs = [
  {m: s.median_m, what: "median"},
  {m: s.geo_mean_m, what: "geometric mean"},
  {m: s.mean_m, what: "mean (dashed)"},
].filter(d => d.m);
return plot({
  marginBottom: 40,
  x: {type: "log", label: "Estimated diameter (m, log scale)", grid: true},
  y: {label: "Asteroids this week (count)", grid: true},
  color: {legend: false},
  marks: [
    Plot.rectY(rows, {x1: "from_m", x2: "to_m", y: "n", fill: "#fbbf24", fillOpacity: 0.8, inset: 1,
      channels: {"from (m)": "from_m", "to (m)": "to_m", "potentially hazardous": "hazardous"}, tip: true}),
    Plot.ruleY([0]),
    Plot.ruleX(refs.slice(0, 2), {x: "m", stroke: "currentColor", strokeOpacity: 0.7}),
    Plot.ruleX(refs.slice(2), {x: "m", stroke: "currentColor", strokeDasharray: "4,3", strokeOpacity: 0.7}),
    Plot.text(refs, {x: "m", text: d => `${d.what} ${d.m} m`, frameAnchor: "top", rotate: -90, textAnchor: "end", dx: -4, dy: 4, fill: "currentColor"}),
    Plot.text([`${s.objects ?? 0} asteroids · sizes modelled from brightness (albedo assumed), so each is uncertain by about ×1.5`], {
      frameAnchor: "top-right", dx: -8, dy: 8, fill: "#71717a"}),
  ],
});