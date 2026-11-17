// The graph and one best split: side A and side B, cut links solid orange,
// uncut links dashed. Hover a node for its side and how many links it cuts.
// data: [links, best split]
const [links, nodes] = data;
const N = nodes.map(d => ({...d}));
const L = links.map(e => ({source: e.source, target: e.target}));
d3.forceSimulation(N).force("link", d3.forceLink(L).id(d => d.node).distance(42))
  .force("charge", d3.forceManyBody().strength(-140)).force("center", d3.forceCenter(0, 0)).stop().tick(400);
const side = new Map(N.map(d => [d.node, d.side]));
const cut = L.filter(e => side.get(e.source.node) !== side.get(e.target.node));
const kept = L.filter(e => side.get(e.source.node) === side.get(e.target.node));
const ln = (rows, o) => Plot.link(rows, {x1: d => d.source.x, y1: d => d.source.y, x2: d => d.target.x, y2: d => d.target.y, ...o});
return plot({
  height: 440, inset: 24, x: {axis: null}, y: {axis: null},
  caption: `${links[0].name}: ${cut.length} of ${links.length} links cut, the most possible`,
  color: {legend: true, domain: ["A", "B"], range: ["#38bdf8", "#f472b6"], label: "Side"},
  marks: [
    ln(kept, {stroke: "currentColor", strokeOpacity: 0.35, strokeDasharray: "3,3"}),
    ln(cut, {stroke: "#f59e0b", strokeWidth: 2.2}),
    Plot.dot(N, {x: "x", y: "y", r: 10, fill: "side", stroke: "black", tip: true,
      channels: {Node: "node", Side: "side", Links: "degree", "Links it cuts": "cut_links"}}),
    Plot.text(N, {x: "x", y: "y", text: "node", fontSize: 9, fill: "black"})
  ]
});