// When: the institution's records per century of dating, over the whole set
// (K-samsök's century facet). A record dated over a range counts in every
// century it spans, so a find dated "Iron Age" (500 BC to AD 1050) is in all
// sixteen of them: read the bars as how much of the collection touches a
// century, not as a sum. Behind them, Sweden's periods as archaeology names
// them (boundaries approximate). Hover a bar for its count.
const [centuries = [], types = []] = data;
const total = types.reduce((a, t) => a + t.records, 0);
const undated = types.reduce((a, t) => a + t.no_dating, 0);
const fmt = (n) => n.toLocaleString("sv-SE");
const lo = Math.min(-4000, ...centuries.map((d) => d.century));
const PERIODS = [
  {name: "Stone Age", from: -12000, to: -1700}, {name: "Bronze Age", from: -1700, to: -500},
  {name: "Iron Age", from: -500, to: 1050}, {name: "Middle Ages", from: 1050, to: 1520},
  {name: "Early modern", from: 1520, to: 1800}, {name: "Modern", from: 1800, to: 2100},
].map((p) => ({...p, from: Math.max(p.from, lo)}));
return plot({
  height: Math.max(320, (fit?.height ?? 420) - 20),
  marginLeft: 64,
  x: {label: "century (negative: BC)", tickFormat: (d) => (d < 0 ? `${-d} BC` : `${d}`), grid: false},
  y: {label: "records dated in that century", grid: true, tickFormat: "~s"},
  color: false,
  marks: [
    Plot.rect(PERIODS, {x1: "from", x2: "to", fill: (d, i) => (i % 2 ? "#a1a1aa" : "#52525b"), fillOpacity: 0.08}),
    Plot.text(PERIODS, {x: (d) => (d.from + d.to) / 2, frameAnchor: "top", dy: 4, text: "name", fill: "#a1a1aa", fontSize: 10}),
    Plot.rectY(centuries, {x1: "century", x2: (d) => d.century + 100, y: "records", fill: "#f59e0b", inset: 0.5,
      channels: {century: "label", records: "records",
                 "share of all records": (d) => (total ? `${((100 * d.records) / total).toFixed(1)}%` : "")},
      tip: {format: {x1: false, x2: false, y: false}}}),
    Plot.ruleY([0]),
    Plot.text([`${fmt(undated)} of ${fmt(total)} records (${total ? ((100 * undated) / total).toFixed(1) : "?"}%) have no dating and are not here`],
      {frameAnchor: "top-right", dy: 18, dx: -4, fill: "currentColor", fontSize: 11}),
  ],
});
