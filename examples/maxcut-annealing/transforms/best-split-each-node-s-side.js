// One best split, node by node: its side and how many of its links it cuts.
// (Found by the same Gray-code walk; the first split that reaches the top.)
(() => {
  const n = data[0].n;
  const adj = Array.from({length: n}, () => []);
  for (const e of data) { adj[e.source].push(e.target); adj[e.target].push(e.source); }
  const side = new Uint8Array(n);
  let cut = 0, best = 0, bestSide = side.slice();
  for (let i = 1; i < 2 ** (n - 1); i++) {
    const v = 31 - Math.clz32(i & -i), s = side[v];
    for (const u of adj[v]) cut += side[u] === s ? 1 : -1;
    side[v] = 1 - s;
    if (cut > best) { best = cut; bestSide = side.slice(); }
  }
  return Array.from({length: n}, (_, v) => ({node: v, side: bestSide[v] ? "B" : "A", degree: adj[v].length,
    cut_links: adj[v].filter(u => bestSide[u] !== bestSide[v]).length}));
})()