// The ground's frequency response, like a Bode plot: amplitude and lag against depth, for the daily and the annual cycle.
const [resp, fits] = data;
const rows = (resp || []).filter(d => d.depth_m > 0);
const f = Object.fromEntries((fits || []).map(d => [d.cycle, d]));
const curve = [];
for (const c of ["daily", "annual"]) {
  if (!f[c]) continue;
  for (let z = 0.035; z <= 1.8; z += 0.01) {
    const r = Math.exp(-(z - 0.035) / f[c].d_amp_m);
    if (r > 1e-5) curve.push({cycle: c, depth_m: z, ratio: r});
  }
}
return plot({
  height: fit?.height ?? 400,
  x: {label: "depth of the layer's middle (m) →", grid: true},
  y: {type: "log", label: "↑ amplitude relative to the top soil layer (log scale)", grid: true, domain: [1e-5, 1.2]},
  color: {legend: true, domain: ["daily", "annual"], range: ["#f97316", "#2563eb"], label: "cycle"},
  marks: [
    Plot.line(curve, {x: "depth_m", y: "ratio", stroke: "cycle", strokeDasharray: "4,3"}),
    Plot.dot(rows.filter(d => d.ratio_vs_top > 0), {x: "depth_m", y: "ratio_vs_top", fill: "cycle", r: d => d.above_noise ? 5 : 3, fillOpacity: d => d.above_noise ? 1 : 0.35, tip: true,
      href: () => "https://open-meteo.com/en/docs/historical-weather-api", target: "_blank",
      channels: {layer: "layer", cycle: "cycle", "amplitude (°C)": "amplitude_c", "of the air's": "ratio_vs_air", "lag behind the air": d => d.cycle === "daily" ? d.lag_air_h + " h" : d.lag_air_days + " days",
                 "lag (degrees of the cycle)": "lag_air_deg", "beyond one RC stage (> 90°)?": d => d.beyond_one_rc ? "yes" : "no",
                 "damping depth from amplitude (m)": "d_amp_m", "from lag (m)": "d_phase_m", "used in the fit": d => d.above_noise ? "yes" : "no: under 1% of the top layer"}}),
  ],
  caption: "Dots: each layer's cycle as a share of the top layer's (faded: under 1% of the top layer's, where the layer averaging and the data's 0.1 °C rounding dominate; left out of the fit). Dashed: e^(−Δz/d), the heat equation's damping with the fitted damping depth d. "
    + "A straight line on a log scale means each extra 10 cm takes the same fraction away. The daily wave loses a factor e every ~10 cm, the yearly one every ~2–3 m: "
    + "the heat equation says d = √(2κ/ω), so a cycle 365 times slower should reach √365 ≈ 19 times deeper. The lags give 15, the amplitudes 33 (fit table): the right order, with thick layers and a κ that changes with the seasons in between. "
    + "Hover a dot: the lag passes 90° at depth, which no single first-order (RC) lag can do: the ground is a chain of infinitely many small RC stages.",
});