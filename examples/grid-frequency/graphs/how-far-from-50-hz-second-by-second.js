// How the deviation is distributed over the day's seconds.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: fit?.height ?? 320,
  x: {label: "frequency − 50 Hz (mHz) →"},
  y: {label: "↑ share of the day's seconds", tickFormat: "%", grid: true},
  marks: [
    Plot.rectY(rows, {x1: "bin_mhz", x2: "bin_end_mhz", y: "share", fill: "#60a5fa", inset: 0.5, tip: true,
      channels: {"from (mHz)": "bin_mhz", "to (mHz)": "bin_end_mhz", seconds: "seconds"}, href: () => "https://www.energy-charts.info/charts/frequency/chart.htm?l=en&c=DE", target: "_blank"}),
    Plot.ruleX([-50, 50], {stroke: "#f97316", strokeDasharray: "4,3"}),
    Plot.ruleX([-10, 10], {stroke: "#a1a1aa", strokeDasharray: "2,3"}),
    Plot.ruleY([0]),
  ],
  caption: "Most seconds lie within ±50 mHz (orange), the standard frequency range; inside ±10 mHz (grey) primary control may stay idle. "
    + "A deviation of 50 mHz means about 750 MW of primary control power at work across Continental Europe (3000 MW per 200 mHz): the controller trades a small, permanent frequency error for stability, as every proportional controller does.",
});