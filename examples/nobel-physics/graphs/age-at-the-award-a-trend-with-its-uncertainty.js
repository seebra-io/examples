// Age at the award, one dot per laureate (year of the award minus year of birth, so +-1 year).
// The band is the 95% interval of each decade's MEAN age (Student t), the line the mean;
// the thin bars the 10th-90th percentile: the spread of ages, which is far wider than the band.
const [laureates, decades] = data;
return plot({
  x: {label: "year of the award", tickFormat: "d"},
  y: {label: "age at the award (years)", grid: true},
  color: false,
  marks: [
    Plot.ruleX(decades, {x: "mid", y1: "p10", y2: "p90", stroke: "currentColor", strokeOpacity: 0.25, strokeWidth: 6}),
    Plot.areaY(decades, {x: "mid", y1: "lo", y2: "hi", fill: "#f59e0b", fillOpacity: 0.3, curve: "monotone-x"}),
    Plot.lineY(decades, {x: "mid", y: "mean_age", stroke: "#f59e0b", strokeWidth: 2, curve: "monotone-x"}),
    Plot.dot(laureates, {x: "year", y: "age", r: 2.5, fill: (d) => d.gender === "female" ? "#f472b6" : "#60a5fa", fillOpacity: 0.8,
      href: "wikipedia", target: "_blank", channels: {name: "name", born: "born", country: "country", motivation: "motivation"}, tip: true}),
    Plot.dot(decades, {x: "mid", y: "mean_age", r: 3, fill: "#f59e0b",
      channels: {decade: "decade", laureates: "n", "95% low": "lo", "95% high": "hi", median: "median_age", "10th pct": "p10", "90th pct": "p90"}, tip: true}),
  ],
});