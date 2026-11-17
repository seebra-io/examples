// Simulated annealing, the classical cousin of what D-Wave's QPU does: start
// from a random split, move one node at a time, always accept a move that
// cuts more, and accept a worse one with probability exp(gain / T) while the
// temperature T falls from 2 to 0.05. A sweep is n moves. Longer schedules
// should find the best cut more often; that is what the study tests.
// 50 runs per schedule, seeded, so the board gives the same answer each time.
// inputs: 0 the graph's links, 1 the exact landscape (for the best cut)
(() => {
  const [links, exact] = data;
  const n = links[0].n, best = exact[0].max_cut;
  const adj = Array.from({length: n}, () => []);
  for (const e of links) { adj[e.source].push(e.target); adj[e.target].push(e.source); }
  let seed = 20261117;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const cutOf = side => links.reduce((c, e) => c + (side[e.source] !== side[e.target]), 0);
  const rows = [];
  const RUNS = 50;
  for (let run = 0; run < RUNS; run++) {          // no annealing: a random split
    const side = Array.from({length: n}, () => rnd() < 0.5 ? 1 : 0);
    const cut = cutOf(side);
    rows.push({method: "Random split", sweeps: 0, run, cut, ratio: cut / best, hit: cut === best ? 1 : 0});
  }
  for (const sweeps of [1, 2, 5, 10, 20, 50, 100, 200, 500]) {
    const steps = sweeps * n, T0 = 2, T1 = 0.05;
    for (let run = 0; run < RUNS; run++) {
      const side = Array.from({length: n}, () => rnd() < 0.5 ? 1 : 0);
      for (let s = 0; s < steps; s++) {
        const T = T0 * (T1 / T0) ** (s / Math.max(1, steps - 1));
        const v = Math.floor(rnd() * n);
        let gain = 0;                                 // links cut minus links uncut by moving v
        for (const u of adj[v]) gain += side[u] === side[v] ? 1 : -1;
        if (gain >= 0 || rnd() < Math.exp(gain / T)) side[v] = 1 - side[v];
      }
      const cut = cutOf(side);
      rows.push({method: "Simulated annealing", sweeps, run, cut, ratio: cut / best, hit: cut === best ? 1 : 0});
    }
  }
  return rows;
})()