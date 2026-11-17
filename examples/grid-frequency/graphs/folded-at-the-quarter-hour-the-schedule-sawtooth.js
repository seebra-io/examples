// Every quarter-hour of the day on top of each other, one line per :00, :15, :30, :45 start.
const rows = Array.isArray(data) ? data : [];
const link = "https://www.energy-charts.info/charts/frequency/chart.htm?l=en&c=DE";
return plot({
  height: fit?.height ?? 380,
  x: {label: "minutes into the quarter-hour →", domain: [0, 15], ticks: d3.range(0, 16, 1)},
  y: {label: "↑ mean frequency − 50 Hz (mHz)", grid: true},
  color: {legend: true, label: "quarter-hour starting at", domain: [":00", ":15", ":30", ":45"], range: ["#dc2626", "#2563eb", "#16a34a", "#9333ea"]},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0, 2], {stroke: "#a1a1aa", strokeDasharray: "3,3"}),
    Plot.lineY(rows, {x: "minute_in_quarter", y: "mean_df_mhz", stroke: "starts_at", strokeWidth: 1.2, strokeOpacity: 0.85}),
    Plot.tip(rows, Plot.pointer({x: "minute_in_quarter", y: "mean_df_mhz", stroke: "starts_at", href: () => link, target: "_blank",
      channels: {"second of the quarter": "sec_of_quarter", "quarters averaged": "quarters", "mean Δf (mHz)": "mean_df_mhz",
                 "95% band (mHz)": d => `${d.lo} … ${d.hi}`, "sd across quarters (mHz)": "sd_df_mhz", "mean |df/dt| (mHz/s)": "mean_abs_rocof_mhz_s"}})),
  ],
  caption: "Folded at 15 minutes, the noise averages out and a sawtooth is left: the frequency climbs through each quarter-hour and drops right after it turns, most at the full hour (red). "
    + "Power is traded in blocks (since October 2025 the day-ahead market clears quarter-hours), so power plants ramp their schedules in steps at the boundaries while demand changes smoothly: the mismatch shows up as frequency, and primary control has to catch it. "
    + "These are the 'deterministic frequency deviations' grid operators know well. Caveat: one day; the sign and size change with the season and the hour of day.",
});