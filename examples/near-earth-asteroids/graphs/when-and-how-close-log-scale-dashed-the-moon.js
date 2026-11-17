// Each asteroid at its closest approach: time against miss distance (log
// scale, in lunar distances), sized by estimated diameter, red when NASA
// flags it potentially hazardous. Hover for the record, click for its JPL page.
const [neos = [], closest = []] = data;
const rows = neos.map(d => ({...d, t: new Date(d.time)}));
const nearest = new Set(closest.slice(0, 5).map(d => d.name));
const chart = plot({
  marginLeft: 56,
  x: {type: "utc", label: "Closest approach (UTC)"},
  y: {type: "log", label: "Miss distance (lunar distances, log scale)", grid: true},
  r: {range: [2, 16], label: "Estimated diameter (m)"},
  color: {domain: [false, true], range: ["#fbbf24", "#ef4444"], legend: true, tickFormat: d => d ? "potentially hazardous" : "not flagged"},
  marks: [
    Plot.ruleY([1], {stroke: "#a1a1aa", strokeDasharray: "4,4"}),
    Plot.text([1], {y: d => d, text: () => "the Moon (384,400 km)", frameAnchor: "right", dy: -6, fill: "#a1a1aa"}),
    Plot.ruleX([new Date()], {stroke: "#f97316", strokeOpacity: 0.6}),
    Plot.dot(rows, {x: "t", y: "miss_ld", r: "size_m", fill: "hazardous", fillOpacity: 0.75, stroke: "#09090b",
      channels: {name: "name", "km": "miss_km", "speed (km/s)": "speed_kms", "size (m)": "size_m",
                 "min–max (m)": d => `${d.d_min_m}–${d.d_max_m}`, H: "magnitude_h"},
      tip: true}),
    Plot.text(rows.filter(d => nearest.has(d.name)), {x: "t", y: "miss_ld", text: "name", dy: -12, fill: "currentColor"}),
  ],
});
// click the hovered asteroid: its JPL Small-Body Database page
chart.addEventListener("click", () => chart.value?.url && window.open(chart.value.url, "_blank", "noopener"));
return chart;