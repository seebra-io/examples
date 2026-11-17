// Every measurement's distance from the all-years curve, by year, low flows and floods apart.
// data[0]: residuals; data[1]: shift (median per decade and flow class)
const [rows, med] = data.map(d => Array.isArray(d) ? d : []);
const classes = ["low (< 60,000 ft³/s)", "medium", "flood (≥ 150,000 ft³/s)"];
const mids = med.map(d => ({...d, year: d.decade + 5}));
return plot({
  height: Math.max(420, (fit?.height ?? 500) - 40),
  fy: {label: null, domain: classes},
  x: {label: "year →", tickFormat: "d"},
  y: {label: "↑ measured discharge vs the all-years curve (%)", grid: true, type: "symlog"},
  marks: [
    Plot.ruleY([0], {stroke: "currentColor"}),
    Plot.dot(rows, {fy: "flow_class", x: "year", y: "res_pct", r: 1.4, fill: "#94a3b8", fillOpacity: 0.5, href: "link", target: "_blank", tip: true,
      channels: {date: "date", "stage (ft)": "stage_ft", "measured (ft³/s)": "discharge_cfs", "curve (ft³/s)": "q_curve", rated: "rated"}}),
    Plot.ruleX(mids, {fy: "flow_class", x: "year", y1: "q25_pct", y2: "q75_pct", stroke: "#f97316", strokeWidth: 4, strokeOpacity: 0.6}),
    Plot.line(mids, {fy: "flow_class", x: "year", y: "median_res_pct", stroke: "#f97316", strokeWidth: 2}),
    Plot.dot(mids, {fy: "flow_class", x: "year", y: "median_res_pct", fill: "#f97316", r: 3.5, tip: true,
      channels: {decade: "decade", measurements: "measurements", "median (%)": "median_res_pct", "25%": "q25_pct", "75%": "q75_pct"}}),
  ],
  caption: "Grey: each measurement, as the percentage more (+) or less (−) water than the single all-years curve says at its stage. Orange: the decade's median and middle half. "
    + "At low flows the residuals climb steadily from the 1950s to the 2020s: a curve fitted to all years would under-report today's low flows badly. Floods stay near zero. "
    + "A rating is a model with a shelf life. Caveat: residuals also hold measurement error (rated Poor ±8% or worse, Good ±5%) and hysteresis (a rising flood carries more than a falling one at the same stage).",
});