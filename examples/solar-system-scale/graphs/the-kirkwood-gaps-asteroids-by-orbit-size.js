// Where the asteroids are, by their orbit's size: the Kirkwood gaps. Jupiter
// sweeps clear the distances where an asteroid would orbit a whole number of
// times for each of Jupiter's (3:1, 5:2, 7:3, 2:1), and gathers the Hildas at
// 3:2 and the trojans in its own orbit. Hover a bar for the count; the dashed
// rules are the resonances (data[1]: regions).
// data: [asteroids {a, class}, elements {regions}]
const [rows, els] = data;
const res = ((els && els.regions) || []).filter(r => r.at_au);
const xs = (Array.isArray(rows) ? rows : []).filter(d => d.a > 1.5 && d.a < 5.6);
return plot({
  marginTop: 40,
  x: {label: "semi-major axis a (AU) →", domain: [1.5, 5.6], grid: true},
  y: {label: "↑ asteroids per 0.02 AU", grid: true},
  color: {legend: true},
  marks: [
    Plot.rectY(xs, Plot.binX({y: "count", title: v => `${v.length} asteroids, a = ${d3.min(v, d => d.a).toFixed(2)}-${d3.max(v, d => d.a).toFixed(2)} AU`}, {x: "a", fill: "group", thresholds: d3.range(1.5, 5.61, 0.02), tip: true})),
    Plot.ruleX(res, {x: "at_au", stroke: "#f87171", strokeDasharray: "3,3"}),
    Plot.text(res, {x: "at_au", text: d => d.name.replace("Kirkwood gap ", ""), frameAnchor: "top", dy: -14, rotate: 0, fill: "#f87171", title: d => d.why}),
    Plot.ruleY([0]),
  ],
});