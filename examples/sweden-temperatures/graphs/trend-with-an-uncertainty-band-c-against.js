// data: trend, one row per station sorted by latitude: temp °C, the fitted
// line (fit), its 95% band (lo–hi) and the wider band for one station
// (lo_station–hi_station); slope in °C per degree of latitude
const W = fit?.width ?? 720, H = fit?.height ?? 420;
const rows = Array.isArray(data) ? data : [];
const s = rows[0] || {};
const quality = d => d.quality === "G" ? "checked" : "suspect or unchecked";
return plot({
  width: W, height: H,
  x: {label: "latitude (°N) →", nice: true},
  y: {label: "↑ air temperature (°C)", grid: true, nice: true},
  color: {domain: ["checked", "suspect or unchecked"], range: ["steelblue", "#facc15"]},
  caption: `Notice: ${s.slope} °C per degree north (95% interval ${s.slope_lo} to ${s.slope_hi}) over ${s.n} stations this hour; `
    + "the narrow band is where the line could be, the wide one where a single station is expected. "
    + "Caveat: one hour is a snapshot, and height above sea and distance to the coast vary with latitude too, so the slope mixes them.",
  marks: [
    Plot.areaY(rows, {x: "lat", y1: "lo_station", y2: "hi_station", fill: "currentColor", fillOpacity: 0.06}),
    Plot.areaY(rows, {x: "lat", y1: "lo", y2: "hi", fill: "#f97316", fillOpacity: 0.25}),
    Plot.lineY(rows, {x: "lat", y: "fit", stroke: "#f97316", strokeWidth: 2}),
    Plot.dot(rows, {
      x: "lat", y: "temp", fill: quality, r: 3, tip: true,
      channels: {station: "station", "height (m)": "height_m", "trend (°C)": "fit", "residual (°C)": "resid"},
    }),
  ],
});