// The periodogram: how much of the series' variance sits at each period, for the published sunspot number and for the signed one.
// data[0]: periodogram {series, period_yr, power}; data[1]: peaks {series, period_yr, relative}; data[2]: summary {mean_length_yr, sd_length_yr, ...}
const [rows, peaks, [s]] = data;
const order = ["sunspot number", "signed (polarity flips each cycle)"];
const top = order.map(k => peaks.find(p => p.series === k)).filter(Boolean);
return plot({
  height: Math.max(420, (fit?.height ?? 480) - 40),
  marginTop: 24,
  fy: {label: null, domain: order, axis: null},
  x: {type: "log", label: "period (years, log scale) →", ticks: [3, 5, 8, 11, 15, 22, 30, 50, 80, 100, 150], tickFormat: "d", grid: true},
  y: {label: "↑ power (share of the peak)", grid: true},
  marks: [
    // each facet's label in its top-left corner (a vertical facet axis can't sit on top)
    Plot.text(order, {fy: d => d, text: d => d, frameAnchor: "top-left", dx: 4, dy: 2, fontWeight: "bold", lineWidth: 90, stroke: "var(--plot-background)", strokeWidth: 3, paintOrder: "stroke"}),
    Plot.rectX([{fy: order[0]}], {fy: "fy", x1: s.mean_length_yr - s.sd_length_yr, x2: s.mean_length_yr + s.sd_length_yr, fill: "#f97316", fillOpacity: 0.12}),
    Plot.lineY(rows, {fy: "series", x: "period_yr", y: d => d.power / d3.max(rows.filter(r => r.series === d.series), r => r.power), stroke: "#38bdf8", strokeWidth: 1.5}),
    Plot.dot(peaks, {fy: "series", x: "period_yr", y: "relative", fill: "#f97316", r: 3, tip: true, channels: {"period (yr)": "period_yr", "relative power": "relative"}}),
    Plot.text(top, {fy: "series", x: "period_yr", y: "relative", text: d => `${d.period_yr} yr`, dx: 8, textAnchor: "start", fill: "currentColor"}),
  ],
  caption: `Top: one sharp peak near 11 years, the Schwabe cycle, computed from nothing but the numbers (the orange band is the mean cycle length from the minima, ${s.mean_length_yr} ± ${s.sd_length_yr} years). `
    + "Its shoulders (about 10 and 12 years) come from the cycles' changing length and strength; the bump near 100 years is the Gleissberg modulation. "
    + "Bottom: flip the sign of every other cycle, as the Sun's magnetic field flips, and the peak moves to about 22 years: the Hale cycle. Counting spots throws the polarity away, like a rectifier, and doubles the frequency.",
});