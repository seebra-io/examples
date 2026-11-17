// Mean lowest rating against age per main-span material (NBI item 43A), 10-year bands with at least 200 bridges.
const rows = Array.isArray(data) ? data : [];
const last = d3.groups(rows, d => d.material).map(([m, v]) => v[v.length - 1]);
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 40),
  marginRight: 150,
  x: {label: "age in 2025 (years, 10-year bands) →", grid: true},
  y: {label: "↑ mean lowest condition rating (0–9)", grid: true},
  color: {legend: false, scheme: "tableau10"},
  marks: [
    Plot.line(rows, {x: "age_mid", y: "mean_rating", stroke: "material", strokeWidth: 1.8}),
    Plot.dot(rows, {x: "age_mid", y: "mean_rating", fill: "material", r: d => Math.max(2, Math.sqrt(d.bridges) / 25), tip: true,
      channels: {material: "material", "age band": d => `${d.band}–${d.band + 9} years`, bridges: "bridges", "mean rating": "mean_rating"}}),
    Plot.text(last, {x: "age_mid", y: "mean_rating", text: "material", fill: "material", textAnchor: "start", dx: 6, fontSize: 10}),
    Plot.ruleY([4.5], {stroke: "#dc2626", strokeOpacity: 0.4, strokeDasharray: "4,3"}),
  ],
  caption: "At the same age the materials are much closer than their poor shares suggest: steel is 14.6% poor overall and prestressed concrete 3.6%, but prestressed bridges are on average 35 years old and steel 54 (see the table). "
    + "Compare along a vertical line, not overall shares: age is the confounder. Timber and steel sit lowest at every age. Hover a dot for its bridges.",
});
