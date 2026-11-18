// How high each orbiter flies: a line from its lowest point (periapsis) to its
// highest (apoapsis) above the surface, log scale. Hover for its orbit and instruments.
const ST = ["Working", "Silent", "Ended", "On the way"];
const SC = ["#4ade80", "#facc15", "#94a3b8", "#60a5fa"];
const rows = data.filter(d => d.where === "In orbit" && d.periapsis_km != null)
  .sort((a, b) => a.periapsis_km - b.periapsis_km);
return plot({
  height: 60 + 30 * rows.length, marginLeft: 210, marginRight: 30,
  caption: "Odyssey, MRO and TGO fly low and nearly circular, for sharp, close-up maps. Mars Express and Tianwen-1 dip as low but swing out past Phobos; Hope never comes closer than 20,000 km, so it sees the whole disk and its weather at once. Grey: ended. Dashed: the orbits of Phobos (about 6,000 km up) and Deimos (about 20,000 km).",
  x: {type: "log", label: "Altitude above the surface (km, log scale)", grid: true, domain: [100, 100000]},
  y: {domain: rows.map(d => d.name), label: null},
  color: {legend: true, domain: ST, range: SC},
  marks: [
    Plot.ruleX([6000, 20070], {stroke: "currentColor", strokeOpacity: 0.3, strokeDasharray: "4,3"}),
    Plot.text([{x: 6000, t: "Phobos"}, {x: 20070, t: "Deimos"}], {x: "x", frameAnchor: "top", text: "t", dy: -2, fontSize: 10, fill: "currentColor"}),
    Plot.link(rows, {x1: "periapsis_km", x2: "apoapsis_km", y1: "name", y2: "name", stroke: "status", strokeWidth: 4, strokeLinecap: "round"}),
    Plot.dot(rows, {x: "periapsis_km", y: "name", fill: "status", r: 5}),
    Plot.dot(rows, {x: "apoapsis_km", y: "name", fill: "status", r: 5}),
    // hover anywhere along the line (an invisible mark at its middle, on the log scale)
    Plot.dot(rows, {x: d => Math.sqrt(d.periapsis_km * d.apoapsis_km), y: "name", r: 14, fill: "white", fillOpacity: 0,
      tip: true, channels: {Agency: "agency", Orbit: "orbit", "Lowest (km)": "periapsis_km", "Highest (km)": "apoapsis_km",
        "Inclination (°)": "inclination_deg", Instruments: "instruments", Status: "status_note"}})
  ]
});