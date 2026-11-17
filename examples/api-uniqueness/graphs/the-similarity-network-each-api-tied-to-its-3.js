// The similarity network: every API tied to its 3 nearest (TF-IDF cosine, place names removed), laid out by a force simulation.
// Ties pull harder the more alike two descriptions are, so near-copies form tight knots and unique APIs drift to the edge.
// data[0]: ranked {id, title, score, root, field, crowd, distinct, nearest_1, similarity_1, link}; data[1]: edges {id, neighbour, rank, similarity}
const [apis, edges] = data;
const width = fit?.width ?? 900, height = Math.max(520, (fit?.height ?? 640) - 40);
const nodes = apis.map(d => ({...d}));
const byId = new Map(nodes.map(d => [d.id, d]));
const links = edges.filter(e => byId.has(e.id) && byId.has(e.neighbour)).map(e => ({source: e.id, target: e.neighbour, similarity: e.similarity}));
// a fixed number of ticks, so the same data gives the same picture (no animation in a static graph)
const sim = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(l => 30 * (1 - l.similarity)).strength(l => 0.2 + l.similarity))
  .force("charge", d3.forceManyBody().strength(-14))
  .force("x", d3.forceX(0).strength(0.04)).force("y", d3.forceY(0).strength(0.04))
  .stop();
for (let i = 0; i < 300; i++) sim.tick();
const big = d3.groupSort(nodes, g => -g.length, d => d.root).slice(0, 9);
const group = d => big.includes(d.root) ? d.root : "other fields";
const segs = links.map(l => ({x1: l.source.x, y1: l.source.y, x2: l.target.x, y2: l.target.y, s: l.similarity}));
return plot({
  width, height, inset: 10,
  x: {axis: null}, y: {axis: null},
  r: {range: [2, 7]},
  color: {domain: [...big, "other fields"], range: [...d3.schemeTableau10.slice(0, 9), "#a1a1aa"], legend: true, label: "top-level field"},
  marks: [
    Plot.link(segs, {x1: "x1", y1: "y1", x2: "x2", y2: "y2", stroke: "currentColor", strokeOpacity: d => 0.08 + 0.6 * d.s, strokeWidth: d => 0.5 + 2 * d.s}),
    // dot size: lower score is bigger, so the crowded knots stand out
    Plot.dot(nodes, {x: "x", y: "y", r: d => 100 - d.score, fill: group, stroke: "white", strokeWidth: 0.4, href: "link", target: "_blank", tip: true,
      channels: {API: "title", score: "score", field: "field", "others in field": "crowd", distinct: "distinct", nearest: "nearest_1", similarity: "similarity_1"}}),
  ],
  caption: "Each dot is an API (bigger = less unique), tied to the 3 APIs whose descriptions are most alike; thicker ties are more alike. "
    + "Colours mixing in one knot are APIs about the same thing filed under different fields (an expand: related sources across the tree); "
    + "a knot of one colour is a crowded field. Click a dot for its Explore page. The layout is a force simulation: distances are only roughly similarities.",
});