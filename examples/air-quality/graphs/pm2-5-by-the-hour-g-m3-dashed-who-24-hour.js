// data: hours {city, time (UTC), day, pm2_5, pm10, no2, o3}, all µg/m³
const W = fit?.width ?? 720, H = fit?.height ?? 420;
const now = new Date();
const rows = (Array.isArray(data) ? data : [])
  .filter(d => d.pm2_5 != null)
  .map(d => ({...d, t: new Date(d.time), part: new Date(d.time) > now ? "forecast" : "past (model run)"}));
const [t0, t1] = d3.extent(rows, d => d.t);
const showsNow = t0 && now > t0 && now < t1;
// cities from the most to the least polluted on average, for the legend
const order = d3.groupSort(rows, v => -d3.mean(v, d => d.pm2_5), d => d.city);
return plot({
  width: W, height: H,
  x: {type: "utc", label: "time (UTC)"},
  y: {label: "↑ PM2.5 (µg/m³)", grid: true, nice: true},
  color: {domain: order, scheme: "tableau10"},
  marks: [
    // the forecast part, shaded
    showsNow ? Plot.rect([{x1: now, x2: t1}], {x1: "x1", x2: "x2", fill: "currentColor", fillOpacity: 0.06}) : null,
    showsNow ? Plot.text([now], {x: d => d, frameAnchor: "top", textAnchor: "start", dx: 4, dy: 4, text: () => "forecast →", fillOpacity: 0.6}) : null,
    // WHO 2021 guideline: 15 µg/m³ as a 24-hour mean (an hour above it is not an exceedance)
    Plot.ruleY([15], {stroke: "#ef4444", strokeDasharray: "5,4"}),
    Plot.text([15], {y: d => d, frameAnchor: "left", textAnchor: "start", dx: 4, dy: -6, fill: "#ef4444", text: () => "WHO 24-hour guideline: 15"}),
    Plot.ruleY([0]),
    Plot.lineY(rows, {
      x: "t", y: "pm2_5", stroke: "city", strokeWidth: 1.5, tip: true,
      channels: {PM10: "pm10", "NO₂": "no2", "O₃": "o3", part: "part"},
    }),
  ],
});