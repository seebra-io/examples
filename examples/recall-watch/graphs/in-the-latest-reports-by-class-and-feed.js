// The records in each feed's latest report, by class (Class I: may cause serious harm or
// death; II: temporary or reversible harm; III: unlikely to harm). Hover for the firms.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: (fit?.height ?? 400) - 40,
  marginLeft: 90,
  x: {label: "recalls in the latest report →", grid: true},
  y: {label: null, domain: ["Class I", "Class II", "Class III", "unclassified"]},
  color: {legend: true, domain: ["drug", "food", "device"], range: ["#f97316", "#22c55e", "#38bdf8"]},
  marks: [
    Plot.barX(rows, Plot.groupY({x: "count", title: v => [...new Set(v.map(d => d.firm))].slice(0, 8).join("\n")}, {y: "class", fill: "feed", title: "firm", tip: true})),
    Plot.ruleX([0]),
  ],
});