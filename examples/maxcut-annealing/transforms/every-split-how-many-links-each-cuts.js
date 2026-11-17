// Every way to split the nodes in two, walked in Gray-code order (one node
// changes side per step, so the cut is updated, not recounted). Node n-1
// stays on side A, so each split is counted once: 2^(n-1) splits.
// One row per cut size: how many splits give it. The top row is the answer.
(() => {
  const n = data[0].n, m = data.length;
  const adj = Array.from({length: n}, () => []);
  for (const e of data) { adj[e.source].push(e.target); adj[e.target].push(e.source); }
  const side = new Uint8Array(n), hist = new Float64Array(m + 1);
  let cut = 0; hist[0] = 1;
  const total = 2 ** (n - 1);
  for (let i = 1; i < total; i++) {
    const v = 31 - Math.clz32(i & -i), s = side[v];
    for (const u of adj[v]) cut += side[u] === s ? 1 : -1;
    side[v] = 1 - s;
    hist[cut]++;
  }
  const best = hist.findLastIndex(c => c > 0);
  return Array.from(hist, (splits, c) => ({cut: c, splits, share: splits / total,
    max_cut: best, optimal: c === best, known_max_cut: data[0].known_max_cut}))
    .filter(d => d.splits > 0);
})()