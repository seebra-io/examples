// Sampling correction: shareholder quorum subsampling (SQS, Alroy 2010), the
// method of the paper's Fig 5, on every bin's occurrences at genus level.
// An occurrence counts in a bin when its age range lies inside it. Each
// trial draws occurrences at random until the genera drawn cover 40% of the
// bin's occurrences (quorum 0.4), with coverage estimated by Good's u =
// 1 - singletons / occurrences; the subsampled richness is the genera drawn,
// averaged over 200 trials (a fixed seed: the same answer on every run).
// Simplified against the paper: global, not per continental region; by
// occurrence, not by collection; no correction for the most common genus.
// A bin whose coverage can't reach the quorum gets no estimate. One that
// only just reaches it (Good's u below 0.6, or under 100 occurrences) is
// marked unreliable: a trial then draws nearly the whole bin, and the
// "subsampled" count is close to the raw one. The claim check leaves those out.
(() => {
  const QUORUM = 0.4, TRIALS = 200, MIN_U = 0.6, MIN_OCCS = 100;
  let seed = 2016;
  const rand = () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const occs = (data[0] && data[0].records) || [];
  const bins = data[1];
  const genusOf = (r) => r.gnl || String(r.tna || "").split(" ")[0];
  return bins.map((b) => {
    const inBin = occs.filter((r) => r.eag <= b.max_ma + 1e-6 && r.lag >= b.min_ma - 1e-6 && genusOf(r));
    const taxa = inBin.map(genusOf);
    const n = taxa.length;
    const count = new Map();
    for (const t of taxa) count.set(t, (count.get(t) || 0) + 1);
    const singletons = [...count.values()].filter((c) => c === 1).length;
    const u = n ? 1 - singletons / n : 0;
    const top = [...count].sort((x, y) => y[1] - x[1]).slice(0, 8).map(([genus, k]) => ({ genus, occurrences: k }));
    const row = {
      bin: b.bin, interval: b.interval, max_ma: b.max_ma, min_ma: b.min_ma, mid_ma: b.mid_ma, mesozoic: b.mesozoic,
      occurrences_in_bin: n,
      collections: new Set(inBin.map((r) => r.cid)).size,
      genera_in_bin: count.size,
      singletons,
      coverage_u: Math.round(u * 1000) / 1000,
      sqs_genera: null, sqs_lo: null, sqs_hi: null,
      reliable: u >= MIN_U && n >= MIN_OCCS,
      top_genera: top.map((t) => `${t.genus} (${t.occurrences})`).join(", "),
      records_url: b.records_url
    };
    if (!n || u < QUORUM) return row;
    const idx = taxa.map((_, i) => i);
    const runs = [];
    for (let k = 0; k < TRIALS; k++) {
      // a partial Fisher-Yates shuffle: draw until the quorum is reached
      const seen = new Set();
      let cov = 0;
      for (let i = 0; i < n && u * cov < QUORUM; i++) {
        const j = i + Math.floor(rand() * (n - i));
        [idx[i], idx[j]] = [idx[j], idx[i]];
        const t = taxa[idx[i]];
        if (!seen.has(t)) { seen.add(t); cov += count.get(t) / n; }
      }
      runs.push(seen.size);
    }
    runs.sort((x, y) => x - y);
    const q = (p) => runs[Math.min(runs.length - 1, Math.floor(p * runs.length))];
    row.sqs_genera = Math.round(runs.reduce((s, v) => s + v, 0) / runs.length * 10) / 10;
    row.sqs_lo = q(0.025);
    row.sqs_hi = q(0.975);
    return row;
  });
})()