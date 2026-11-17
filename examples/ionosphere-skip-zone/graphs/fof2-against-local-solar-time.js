// foF2 against local solar time: one snapshot, many longitudes, so the globe gives the day's curve.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: fit?.height ?? 320,
  x: {label: "local solar time (h) →", domain: [0, 24], ticks: d3.range(0, 25, 3)},
  y: {label: "↑ foF2 (MHz)", grid: true},
  color: {legend: true, domain: ["day (07–17 local solar time)", "twilight", "night"], range: ["#f59e0b", "#a855f7", "#1d4ed8"]},
  marks: [
    Plot.rectX([{x1: 7, x2: 17}], {x1: "x1", x2: "x2", fill: "#fbbf24", fillOpacity: 0.08}),
    Plot.dot(rows, {x: "lst", y: "fof2", fill: "daylight", r: 5, tip: true,
      channels: {station: "name", "latitude (°)": "lat", "foF2 (MHz)": "fof2", "peak density (10¹¹/m³)": "nmax_e11_m3", "MUF(3000) (MHz)": "mufd"}}),
    Plot.text(rows, {x: "lst", y: "fof2", text: "code", dx: 7, textAnchor: "start", fontSize: 9}),
  ],
  caption: "Each station's newest reading, placed at its local solar time. foF2 ∝ √(peak electron density): daylight builds the F2 layer up, and it decays through the night. High-latitude stations (Alaska) are lowest. Caveat: one snapshot, so latitude and season mix with the time of day.",
});