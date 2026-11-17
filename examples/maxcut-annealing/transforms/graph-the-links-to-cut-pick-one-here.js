// The graph to cut, one row per link. Pick another by changing GRAPH:
// "petersen" (10 nodes), "regular20", "random22" or "grid4x6" (a check:
// a grid's best split cuts every link). Up to about 26 nodes stays quick.
(() => {
  const GRAPH = "regular20";
  const g = data.graphs.find(g => g.id === GRAPH) || data.graphs[0];
  return g.edges.map(([source, target]) => ({graph: g.id, name: g.name, about: g.about, n: g.n, m: g.m,
    source, target, known_max_cut: g.max_cut}));
})()