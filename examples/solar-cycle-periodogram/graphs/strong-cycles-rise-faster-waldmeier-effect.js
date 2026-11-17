// The Waldmeier effect: strong cycles rise to their maximum faster.
// data: cycles {cycle, rise_yr, peak_smoothed, length_yr, complete, link}
const rows = (Array.isArray(data) ? data : []).filter(d => d.complete);
return plot({
  height: Math.max(320, (fit?.height ?? 380) - 40),
  x: {label: "rise time, minimum to smoothed maximum (years) →", grid: true},
  y: {label: "↑ cycle maximum (13-month smoothed sunspot number)", grid: true},
  color: {type: "linear", scheme: "viridis", legend: true, label: "cycle length (years)"},
  marks: [
    Plot.dot(rows, {x: "rise_yr", y: "peak_smoothed", fill: "length_yr", r: 5, href: "link", target: "_blank", tip: true, channels: {cycle: "cycle", started: "start", "length (yr)": "length_yr"}}),
    Plot.text(rows, {x: "rise_yr", y: "peak_smoothed", text: d => String(d.cycle), dy: -10, fill: "currentColor", fillOpacity: 0.7}),
    Plot.linearRegressionY(rows, {x: "rise_yr", y: "peak_smoothed", stroke: "#f97316"}),
  ],
  caption: "Each dot a complete cycle: the stronger the cycle, the sooner it peaks (Waldmeier 1935), which lets forecasters guess a cycle's size from its first years. "
    + "That variable shape is why the periodogram's peak is broad. Cycle 25, still running, is left out; click a cycle for its page.",
});