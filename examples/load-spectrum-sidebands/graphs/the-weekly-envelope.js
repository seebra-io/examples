// The envelope: each day's mean load and swing.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: fit?.height ?? 300,
  x: {label: "day →", type: "band", tickFormat: (d, i) => i % 7 === 0 ? d.slice(5) : ""},
  y: {label: "↑ GW", grid: true},
  color: {legend: true, domain: ["Mon–Fri", "Saturday", "Sunday"], range: ["#2563eb", "#f59e0b", "#dc2626"]},
  marks: [
    Plot.ruleX(rows, {x: "date", y1: "min_gw", y2: "max_gw", stroke: "day_type", strokeWidth: 4, strokeOpacity: 0.7}),
    Plot.dot(rows, {x: "date", y: "mean_gw", fill: "day_type", r: 3, tip: true,
      channels: {date: "date", "day type": "day_type", "mean (GW)": "mean_gw", "swing max−min (GW)": "swing_gw", "min (GW)": "min_gw", "max (GW)": "max_gw"}}),
  ],
  caption: "Each bar runs from the day's lowest to highest hour, the dot is its mean. The weekly envelope is the pattern the sidebands encode: lower and flatter at weekends.",
});