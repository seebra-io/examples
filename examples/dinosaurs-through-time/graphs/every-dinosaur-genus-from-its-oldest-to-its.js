// Every dinosaur genus (body fossils) as a line from its oldest to its youngest
// find, grouped by clade and sorted by first appearance. Time runs left to
// right, from the Triassic to the end of the Cretaceous (Ma = million years ago).
const PERIODS = [
  {name: "Triassic", from: 251.9, to: 201.4},
  {name: "Jurassic", from: 201.4, to: 145},
  {name: "Cretaceous", from: 145, to: 66}
];
const rows = data
  .filter(d => !d.trace_fossil)
  .sort((a, b) => a.clade.localeCompare(b.clade) || b.first_ma - a.first_ma)
  .map((d, i) => ({...d, row: i}));
const n = rows.length;

return plot({
  marginTop: 28,
  x: {domain: [252, 62], label: "Million years ago", grid: true},
  y: {axis: null, domain: [0, n]},
  color: {legend: true},
  marks: [
    // the three periods as bands
    Plot.rectX(PERIODS, {x1: "from", x2: "to", y1: 0, y2: n, fill: "currentColor",
                         fillOpacity: (d, i) => i % 2 ? 0.03 : 0.07}),
    Plot.text(PERIODS, {x: d => (d.from + d.to) / 2, y: n, text: "name", dy: -10, fontWeight: 600}),
    // the end-Cretaceous impact
    Plot.ruleX([66], {strokeDasharray: "4,3"}),
    Plot.text([66], {x: d => d, y: 0, text: () => "K–Pg impact, 66 Ma", textAnchor: "end", dx: -4, dy: -4}),
    // one line per genus
    Plot.link(rows, {x1: "first_ma", x2: "last_ma", y1: "row", y2: "row", stroke: "clade", strokeWidth: 1.4}),
    Plot.dot(rows, {x: "first_ma", y: "row", r: 0.8, fill: "clade"}),
    // hover: the nearest genus row
    Plot.tip(rows, Plot.pointerY({x: "first_ma", y: "row",
      title: d => `${d.genus}${d.family ? " · " + d.family : ""}\n${d.clade}\n` +
                  `${d.first_interval} → ${d.last_interval}\n${d.first_ma}–${d.last_ma} Ma · ${d.finds} finds in PBDB`}))
  ]
});