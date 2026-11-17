// Lag against depth: in the heat equation the phase grows linearly with depth, φ = Δz/d.
const [resp, fits] = data;
const rows = (resp || []).filter(d => d.depth_m > 0 && d.above_noise);
const f = Object.fromEntries((fits || []).map(d => [d.cycle, d]));
const line = [];
for (const c of ["daily", "annual"]) if (f[c]) for (let z = 0.035; z <= 1.8; z += 0.02) {
  const deg = (z - 0.035) / f[c].d_phase_m * 57.29578;
  if (deg < 400) line.push({cycle: c, depth_m: z, deg});
}
return plot({
  height: fit?.height ?? 360,
  x: {label: "depth of the layer's middle (m) →", grid: true},
  y: {label: "↑ lag behind the top soil layer (degrees of the cycle)", grid: true},
  color: {legend: true, domain: ["daily", "annual"], range: ["#f97316", "#2563eb"], label: "cycle"},
  marks: [
    Plot.ruleY([90], {stroke: "#a1a1aa", strokeDasharray: "2,3"}),
    Plot.text([{y: 90}], {y: "y", x: 1.75, text: () => "90°: the most one RC stage can lag", dy: -6, textAnchor: "end", fill: "#71717a", fontSize: 10}),
    Plot.line(line, {x: "depth_m", y: "deg", stroke: "cycle", strokeDasharray: "4,3"}),
    Plot.dot(rows, {x: "depth_m", y: "lag_top_deg", fill: "cycle", r: 5, tip: true, href: () => "https://open-meteo.com/en/docs/historical-weather-api", target: "_blank",
      channels: {layer: "layer", cycle: "cycle", "lag behind top layer (°)": "lag_top_deg", "lag behind the air": d => d.cycle === "daily" ? d.lag_air_h + " h" : d.lag_air_days + " days", "damping depth from lag (m)": "d_phase_m"}}),
  ],
  caption: "The deeper, the later, in proportion: 360° is a full cycle, so the yearly wave at 1–2.5 m is about two months behind the surface, and the daily wave at 28–100 cm (not drawn, almost no amplitude) half a day. "
    + "A lumped first-order system (a house, a cup of tea: one heat capacity, one resistance) can never lag more than 90°; distributed systems (soil, walls, cables, transmission lines) can.",
});