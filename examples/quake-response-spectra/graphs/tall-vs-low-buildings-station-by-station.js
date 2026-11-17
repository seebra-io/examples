// Every station: SA(3 s)/SA(0.3 s) against distance (log scale), with the fitted trend.
const rows = Array.isArray(data[0]) ? data[0] : [];
const t = (Array.isArray(data[1]) ? data[1] : [])[0];
return plot({
  height: fit?.height ?? 380,
  x: {label: "distance from the rupture (km) →", grid: true},
  y: {label: "↑ SA(3 s) / SA(0.3 s): tall-building over low-building shaking", type: "log", grid: true},
  color: {legend: true, label: "network"},
  marks: [
    Plot.ruleY([1], {stroke: "#a1a1aa", strokeDasharray: "3,3"}),
    Plot.dot(rows, {x: "distance_km", y: "long_short", fill: "network", r: 2.5, fillOpacity: 0.7, tip: true,
      href: d => `https://earthquake.usgs.gov/earthquakes/eventpage/ci38457511/shakemap/stations`, target: "_blank",
      channels: {station: "station", name: "name", "distance (km)": "distance_km", "PGA (%g)": "pga", "SA 0.3 s (%g)": "psa03", "SA 1 s (%g)": "psa10", "SA 3 s (%g)": "psa30", "PGV (cm/s)": "pgv"}}),
    t ? Plot.line([[25, t.ratio_at_25km], [400, t.ratio_at_400km]], {stroke: "#dc2626", strokeWidth: 2.5}) : null,
  ],
  caption: t ? `The ratio grows by a factor of ${t.per_100km_factor} per 100 km (r = ${t.r}, ${t.stations} stations): from ${t.ratio_at_25km} at 25 km to ${t.ratio_at_400km} at 400 km. Scatter comes from the site (soft basins such as Los Angeles amplify long periods) and the path. Hover a dot; click for USGS's station table.` : "",
});