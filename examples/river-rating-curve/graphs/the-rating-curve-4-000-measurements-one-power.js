// The rating curve: every field measurement (stage read, discharge measured), the one curve fitted to all of them,
// and the annual flood peaks. data[0]: residuals (measurements); data[1]: curves; data[2]: peaks
const [meas, curves, peaks] = data.map(d => Array.isArray(d) ? d : []);
const all = curves.filter(d => d.era === "all years");
const top = d3.max(meas, d => d.stage_ft);
const best = all[0] || {};
return plot({
  height: Math.max(440, (fit?.height ?? 520) - 40),
  x: {type: "log", label: "discharge (ft³/s, log scale) →", grid: true, tickFormat: "~s"},
  y: {label: "↑ stage, gage height (ft)", grid: true},
  color: {type: "sequential", scheme: "viridis", legend: true, label: "year measured"},
  marks: [
    Plot.dot(meas, {x: "discharge_cfs", y: "stage_ft", fill: "year", r: 1.6, fillOpacity: 0.6, href: "link", target: "_blank", tip: true,
      channels: {date: "date", "rated": "rated", "curve says (ft³/s)": "q_curve", "measured vs curve (%)": "res_pct"}}),
    Plot.line(all.filter(d => d.discharge_cfs > 0), {x: "discharge_cfs", y: "stage_ft", z: "part", stroke: "currentColor", strokeWidth: 2,
      strokeDasharray: d => d.part === "extrapolated" ? "5,4" : null, tip: true,
      channels: {curve: "era", "b (exponent)": "b", "e, zero-flow stage (ft)": "e", "C": "C"}}),
    Plot.ruleY([top], {stroke: "#ef4444", strokeDasharray: "3,3"}),
    Plot.text([top], {y: d => d, x: d3.min(meas, d => d.discharge_cfs), text: d => `highest stage ever measured: ${d} ft`, dy: -6, textAnchor: "start", fill: "#ef4444"}),
    Plot.dot(peaks, {x: "peak_cfs", y: "peak_stage_ft", symbol: "triangle", r: 4, stroke: "#ef4444", fill: d => d.above_measured ? "#ef4444" : "none",
      href: "link", target: "_blank", tip: true,
      channels: {"water year": "water_year", date: "date", "published peak (ft³/s)": "peak_cfs", "today's curve gives (ft³/s)": "q_curve", "curve vs published (%)": "curve_vs_published_pct", flags: "flags"}}),
  ],
  caption: `Missouri River at Hermann, MO. Dots: ${meas.length} field measurements (a hydrographer measures velocity across the river and reads the gage), coloured by year. `
    + `Line: one power law Q = C (h − e)^b fitted to all of them (b = ${best.b}, e = ${best.e} ft); dashed where it runs beyond the measurements. `
    + "Triangles: annual peaks, filled when the peak stage is above anything ever measured. Notice the colours: the same stage holds more water in recent (yellow) years than in the 1950s (purple), "
    + "because the bed has moved: one curve for all years can't be right. Hover a dot for its date, rating and how far it is from the curve; click for the gage's page.",
});