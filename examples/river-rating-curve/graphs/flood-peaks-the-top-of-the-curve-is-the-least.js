// Annual flood peaks: the discharge USGS published against what today's single curve and the equally good curves give at the peak stage.
// data[0]: peaks; data[1]: extrapolation summary
const [rows, summary] = data.map(d => Array.isArray(d) ? d : []);
const s = summary[0] || {};
const top = rows.length ? rows[0].max_measured_stage : null;
return plot({
  height: Math.max(420, (fit?.height ?? 500) - 40),
  x: {label: "peak stage (ft) →", grid: true},
  y: {type: "log", label: "↑ peak discharge (ft³/s, log scale)", grid: true, tickFormat: "~s"},
  marks: [
    Plot.ruleX([top], {stroke: "#ef4444", strokeDasharray: "3,3"}),
    Plot.ruleX(rows, {x: "peak_stage_ft", y1: "q_curve_lo", y2: "q_curve_hi", stroke: "#3b82f6", strokeOpacity: 0.35, strokeWidth: 3}),
    Plot.dot(rows, {x: "peak_stage_ft", y: "q_curve", fill: "#3b82f6", r: 2.5, tip: true,
      channels: {"water year": "water_year", "curve (ft³/s)": "q_curve", "curves within the e interval": d => `${d.q_curve_lo}–${d.q_curve_hi}`}}),
    Plot.dot(rows, {x: "peak_stage_ft", y: "peak_cfs", symbol: "triangle", r: 4.5, stroke: "#ef4444", fill: d => d.above_measured ? "#ef4444" : "none",
      href: "link", target: "_blank", tip: true,
      channels: {"water year": "water_year", date: "date", "published (ft³/s)": "peak_cfs", "curve (ft³/s)": "q_curve", "curve vs published (%)": "curve_vs_published_pct", flags: "flags"}}),
    Plot.text(rows.filter(d => d.peak_cfs >= 600000 || d.above_measured), {x: "peak_stage_ft", y: "peak_cfs", text: d => String(d.water_year), dy: -10, fill: "#ef4444"}),
  ],
  caption: `Red triangles: the ${s.peaks ?? rows.length} annual peaks as published; blue: what the all-years curve gives at the same stage (bar: the curves whose zero-flow stage e is in its 95% interval). `
    + `Dashed: the highest stage ever measured, ${s.max_measured_stage_ft} ft; only ${s.measurements_above_30ft} of ${s.measurements} measurements are at 30 ft or more. `
    + `At the record stage (${s.record_stage_ft} ft, ${s.record_year}) the curve gives ${s.record_q_curve} ft³/s against the published ${s.record_published_cfs} (${s.record_curve_vs_published_pct}%), and the curves whose e is in its 95% interval differ by only ${s.spread_at_record_pct}%: the statistics are far too confident. `
    + `The real uncertainty is in the measurements themselves: the ${s.top_measurements} measured at 34.5 ft or more range from ${s.top_min_cfs} to ${s.top_max_cfs} ft³/s (×${s.top_max_over_min}), because in a flood the stage also depends on whether the river is rising or falling, on backwater from the Mississippi and on levees failing upstream. `
    + "The historic peaks of 1844 and 1903 (estimated from flood marks) sit far from today's curve at their stage: the channel, levees and gage datum were different. Hover a peak for its flags; click for the gage.",
});