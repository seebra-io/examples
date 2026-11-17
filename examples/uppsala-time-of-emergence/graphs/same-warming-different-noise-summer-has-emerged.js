// The aha: the same warming, against different noise. Each tick is one season-year; grey the 1850–1900 years, red the last 30.
// data[0]: anomalies; data[1]: emergence {season, base_sd_c, warming_c, signal_to_noise, recent_warmer_than_any_base_pct}
const [rows, em] = data.map(d => Array.isArray(d) ? d : []);
const shown = rows.filter(d => d.era !== "other years");
const by = new Map(em.map(d => [d.season, d]));
const notes = em.map(d => ({season: d.season,
  text: `warming ${d.warming_c} °C, σ ${d.base_sd_c} °C → S/N ${d.signal_to_noise}; ${d.recent_warmer_than_any_base_pct}% of recent years warmer than any 1850–1900 one`}));
return plot({
  height: Math.max(420, (fit?.height ?? 460) - 40),
  marginLeft: 110,
  x: {label: "anomaly of the season's mean daily minimum (°C, vs 1850–1900) →", grid: true},
  fy: {label: null},
  color: {domain: ["1850–1900 (pre-industrial)", "1996–2025 (last 30 years)"], range: ["#64748b", "#dc2626"], legend: true, label: "years"},
  marks: [
    Plot.ruleX([0], {stroke: "currentColor", strokeOpacity: 0.4}),
    Plot.tickX(shown, {x: "anomaly_c", fy: "season", stroke: "era", strokeWidth: 2, strokeOpacity: 0.8, tip: true,
      channels: {year: "year", "mean daily minimum (°C)": "mean_tmin_c", "anomaly (°C)": "anomaly_c", "z (σ of 1850–1900)": "z", note: "outside"}}),
    Plot.ruleX(em, {x: d => d.base_warmest_c - d.base_mean_c, fy: "season", stroke: "#64748b", strokeDasharray: "4,3", tip: true,
      channels: {"warmest 1850–1900 season (°C anomaly)": d => d.base_warmest_c - d.base_mean_c}}),
    Plot.text(notes, {fy: "season", text: "text", frameAnchor: "top-left", dy: 4, dx: 4, fontSize: 11}),
  ],
  caption: "Signal-to-noise is what makes a change visible. Winter warmed as much as summer, but a single winter swings by ±2.3 °C (σ), so most recent winters still fall inside the 1850–1900 range: "
    + "the red and grey ticks overlap. Summer nights vary by only ±0.9 °C, so a 3.1 °C warming carries them clear of the old climate: 28 of the last 30 summers were warmer than the warmest pre-industrial one (dashed line), against 14 of 30 winters. "
    + "Climate scientists call the moment a season's signal leaves its noise its time of emergence; it comes first where the noise is small (summer, the tropics), not where the warming is largest. Hover a tick for its year."
});
