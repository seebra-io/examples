// Recalls per report day in each feed (drug and food report weekly, devices post daily).
// The outlined bars are each feed's latest report: what's new. Hover for the Class I count
// (may cause serious harm or death). Few rows on a day can be a quiet week or a late report.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: (fit?.height ?? 400) - 40,
  x: {label: "report day", type: "band", tickRotate: -30},
  y: {label: "↑ recalls", grid: true},
  color: {legend: true, domain: ["drug", "food", "device"], range: ["#f97316", "#22c55e", "#38bdf8"]},
  marks: [
    Plot.barY(rows, {x: "reported", y: "recalls", fill: "feed", channels: {"Class I": "class_i"}, tip: true}),
    Plot.barY(rows.filter(d => d.latest), {x: "reported", y: "recalls", fill: "feed", stroke: "currentColor", strokeWidth: 1.5}),
    Plot.ruleY([0]),
  ],
});