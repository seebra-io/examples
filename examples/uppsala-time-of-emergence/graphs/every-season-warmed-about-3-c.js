// Every season's mean night-time minimum against its own 1850–1900 climate, one dot per year, a 15-year running mean through them.
// data: anomalies {year, season, era, mean_tmin_c, anomaly_c, z, base_mean_c, base_sd_c, outside}
const rows = Array.isArray(data) ? data : [];
const station = "https://www.ncei.noaa.gov/cdo-web/datasets/GHCND/stations/GHCND:SWE00139148/detail";
return plot({
  height: Math.max(520, (fit?.height ?? 560) - 40),
  marginRight: 110,
  x: {label: "year →", tickFormat: "d", grid: true},
  y: {label: "↑ anomaly of the season's mean daily minimum (°C, vs 1850–1900)", grid: true},
  fy: {label: null},
  color: {domain: ["1850–1900 (pre-industrial)", "other years", "1996–2025 (last 30 years)"], range: ["#64748b", "#a8a29e", "#dc2626"], legend: true, label: "era"},
  marks: [
    Plot.ruleY([0], {stroke: "currentColor", strokeOpacity: 0.5}),
    Plot.dot(rows, {x: "year", y: "anomaly_c", fy: "season", fill: "era", r: 2.2, fillOpacity: 0.75, href: () => station, target: "_blank", tip: true,
      channels: {"mean daily minimum (°C)": "mean_tmin_c", "anomaly (°C)": "anomaly_c", "anomaly in σ of 1850–1900 (z)": "z", "days measured": "days", note: "outside"}}),
    Plot.lineY(rows, Plot.windowY({k: 15, anchor: "middle"}, {x: "year", y: "anomaly_c", fy: "season", stroke: "currentColor", strokeWidth: 2, tip: true,
      channels: {"15-year running mean (°C)": "anomaly_c"}})),
  ],
  caption: "Uppsala (GHCN-D SWE00139148), daily minimum temperature, seasonal means. Each season is compared with its own 1850–1900 mean (the IPCC's pre-industrial baseline). "
    + "All four seasons have warmed by about 3 °C (2.9 in autumn to 3.6 in spring), about twice the global land average, partly because Uppsala grew around the thermometer (see the caveats). "
    + "Winter dots scatter over ±5 °C, summer dots over ±2 °C: that spread is the noise the next graph measures the warming against. The record has gaps (1868–83, 1922–30, 1945–58); the running mean bridges them. Click a dot for the station's NOAA record."
});
