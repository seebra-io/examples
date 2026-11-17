// Hours per month for your eight most played artists (the rest grey): when
// each one came in and how long it stayed. Hover for the month's numbers.
const totals = {};
for (const d of data) totals[d.artist] = (totals[d.artist] || 0) + d.minutes;
const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 8).map(d => d[0]);
const rows = data.map(d => ({...d, who: top.includes(d.artist) ? d.artist : "Everyone else",
                             month: new Date(d.month + "-01T00:00:00Z")}));
return plot({
  marginLeft: 50,
  x: {label: null, type: "utc"},
  y: {label: "Hours listened", grid: true},
  color: {legend: true, domain: [...top, "Everyone else"],
          range: [...d3.schemeTableau10.slice(0, 8), "#777"]},
  marks: [
    Plot.areaY(rows, Plot.groupX({y: ds => ds.reduce((s, d) => s + d.minutes, 0) / 60},
      {x: "month", fill: "who", order: [...top, "Everyone else"], curve: "step", tip: true})),
    Plot.ruleY([0])
  ]
});