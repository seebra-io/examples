// Growth per year of each measure, before and after the break, with 95% intervals.
// data: eras {series, measure, era, slope, slope_lo, slope_hi, growth_pct, doubling_years, n}
const rows = (Array.isArray(data) ? data : []);
const order = ["transistors", "single-thread", "frequency", "power", "cores"];
return plot({
  height: Math.max(300, (fit?.height ?? 360) - 20),
  marginLeft: 100,
  x: {label: "doublings per year (slope of log2(value) on year) →", grid: true},
  y: {domain: order, label: null},
  color: {legend: true, label: "era"},
  marks: [
    Plot.ruleX([0, 0.5], {strokeOpacity: d => d === 0 ? 1 : 0.3}),
    Plot.link(rows, {y1: "series", y2: "series", x1: "slope_lo", x2: "slope_hi", stroke: "era", strokeWidth: 3, strokeOpacity: 0.5, dy: 0}),
    Plot.dot(rows, {x: "slope", y: "series", fill: "era", r: 6, tip: true,
      channels: {measure: "measure", "growth %/yr": "growth_pct", "doubling time (yr)": "doubling_years", "95% interval": d => `${d.slope_lo} to ${d.slope_hi}`, processors: "n", "years": d => `${d.year_from}–${d.year_to}`}}),
  ],
  caption: "0.5 doublings per year is Moore's 'every two years'. Transistors stay near it in both eras; clock and power drop to about zero after the break (the end of Dennard scaling), and cores rise.",
});