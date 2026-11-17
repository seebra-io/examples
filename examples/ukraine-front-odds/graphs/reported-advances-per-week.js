// Places DeepStateMap reported changing hands, per week and side (from its
// update log). A count of reported places, not area: one update can name
// one village or three. The area step gives the net km².
const rows = (Array.isArray(data) ? data : []).map(d => ({...d, week: new Date(d.week)}));
return plot({
  marginLeft: 44,
  x: {type: "time", label: "Week (Monday)", tickFormat: "%d %b", grid: false},
  y: {label: "Places reported changing hands", grid: true},
  color: {domain: ["Russian advance", "Ukrainian advance", "other"], range: ["#ef4444", "#3b82f6", "#a1a1aa"], legend: true},
  marks: [
    Plot.rectY(rows, {x: "week", interval: "week", y: "places", fill: "side", tip: true}),
    Plot.ruleY([0]),
  ],
});
