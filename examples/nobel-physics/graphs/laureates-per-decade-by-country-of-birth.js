// Laureates per decade, coloured by country of birth (the seven most common; the rest
// "other"). Country is the birth country as named then (Prussia, USSR, ...), not today's.
const top = d3.rollups(data, (v) => v.length, (d) => d.country ?? "unknown").sort((a, b) => b[1] - a[1]).slice(0, 7).map(([c]) => c);
const group = (d) => top.includes(d.country ?? "unknown") ? (d.country ?? "unknown") : "other";
return plot({
  x: {label: "decade of the award", tickFormat: (d) => `${d}s`, type: "band"},
  y: {label: "laureates (people; a shared prize counts each)", grid: true},
  color: {domain: [...top, "other"], label: "born in"},
  marks: [
    Plot.barY(data, Plot.groupX({y: "count", title: (names) => names.join(", ")},
      {x: "decade", fill: group, title: "name", order: [...top, "other"], tip: true})),
    Plot.ruleY([0]),
  ],
});