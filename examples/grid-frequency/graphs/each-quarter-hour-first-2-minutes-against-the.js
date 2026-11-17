// Each quarter-hour of the day: mean |Δf| in its first two minutes against the rest of it.
const rows = Array.isArray(data) ? data : [];
const m = Math.max(5, d3.max(rows, d => Math.max(d.first_abs_df_mhz, d.rest_abs_df_mhz)) * 1.05);
return plot({
  height: fit?.height ?? 380,
  x: {label: "mean |Δf| in the rest of the quarter-hour (mHz) →", domain: [0, m], grid: true},
  y: {label: "↑ mean |Δf| in its first 2 minutes (mHz)", domain: [0, m], grid: true},
  color: {legend: true, label: "quarter-hour", domain: [true, false], range: ["#dc2626", "#2563eb"], tickFormat: d => d ? "starts on the hour" : "starts at :15, :30, :45"},
  marks: [
    Plot.line([[0, 0], [m, m]], {stroke: "#a1a1aa", strokeDasharray: "4,3"}),
    Plot.dot(rows, {x: "rest_abs_df_mhz", y: "first_abs_df_mhz", fill: "on_the_hour", r: 3.5, tip: true, href: () => "https://www.energy-charts.info/charts/frequency/chart.htm?l=en&c=DE", target: "_blank",
      channels: {"starts (UTC)": "starts", "first 2 min (mHz)": "first_abs_df_mhz", "rest (mHz)": "rest_abs_df_mhz", "difference (mHz)": "diff_abs_df_mhz",
                 "mean Δf, first 2 min (signed, mHz)": "first_df_mhz", "|df/dt| first 2 min (mHz/s)": "first_rocof", "|df/dt| rest (mHz/s)": "rest_rocof"}}),
  ],
  caption: "Above the dashed line: the frequency was further from 50 Hz just after the quarter-hour turned than during the rest of it. "
    + "This is the study's test unit: the 96 quarter-hours are nearly independent, the 86,000 seconds are not (one second's frequency is almost the last one's), so a test over seconds would be far too confident.",
});