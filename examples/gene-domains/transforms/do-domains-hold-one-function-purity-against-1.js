// Do genes that share a domain share a function? For every domain with 3 or
// more annotated genes (innermost domain; "Not annotated" left out), the
// share of its genes in its most common system ("purity"). The test: shuffle
// the systems among the same genes 1,000 times (domain sizes kept), and see
// how often the shuffled mean purity reaches the observed one.
// Neighbouring genes that came from one gene duplicating (a family in tandem:
// HOXA, the T-cell receptor beta locus, olfactory and taste receptors) share
// a function and a domain both, so the second test shuffles within windows
// of 5 Mb only: what is left is closer to the domain itself.
(() => {
  const {genes = [], domains = []} = data;
  const MIN = 3, PERMS = 1000, WINDOW = 5e6;
  // a fixed seed: the same answer on every run (mulberry32)
  let seed = 20141211;
  const rand = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const inDomains = genes.filter((g) => g.domain && g.system !== "Not annotated");
  const groups = {};
  for (const g of inDomains) (groups[g.domain] ||= []).push(g);
  const tested = Object.entries(groups).filter(([, gs]) => gs.length >= MIN);
  const idx = new Map(inDomains.map((g, i) => [g, i]));
  const purity = (systems) => {
    let sum = 0;
    for (const [, gs] of tested) {
      const c = {};
      for (const g of gs) { const s = systems[idx.get(g)]; c[s] = (c[s] || 0) + 1; }
      sum += Math.max(...Object.values(c)) / gs.length;
    }
    return tested.length ? sum / tested.length : null;
  };
  const real = inDomains.map((g) => g.system);
  const observed = purity(real);

  const run = (shuffled) => {
    const null_ = [];
    for (let p = 0; p < PERMS; p++) null_.push(purity(shuffled()));
    const mean = null_.reduce((s, x) => s + x, 0) / PERMS;
    const p = (1 + null_.filter((x) => x >= observed).length) / (PERMS + 1);
    return {mean, p, null_};
  };
  const global = run(() => shuffle([...real]));
  // within windows: genes keep their system's neighbourhood
  const windows = {};
  inDomains.forEach((g, i) => (windows[Math.floor(g.start / WINDOW)] ||= []).push(i));
  const local = run(() => {
    const s = [...real];
    for (const is of Object.values(windows)) {
      const vals = shuffle(is.map((i) => real[i]));
      is.forEach((i, k) => (s[i] = vals[k]));
    }
    return s;
  });

  const perDomain = tested.map(([id, gs]) => {
    const c = {};
    for (const g of gs) c[g.system] = (c[g.system] || 0) + 1;
    const [system, n] = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
    const d = domains.find((x) => x.id === id) || {};
    return {domain: id, label: d.label, size_kb: d.size_kb, annotated: gs.length, top_system: system,
            purity: Math.round(100 * n / gs.length) / 100, genes: gs.map((g) => g.gene).join(", ")};
  }).sort((a, b) => b.purity - a.purity || b.annotated - a.annotated);

  return {
    domains_tested: tested.length,
    genes_tested: tested.reduce((s, [, gs]) => s + gs.length, 0),
    observed,
    shuffled_anywhere: {mean: global.mean, p: global.p},
    shuffled_nearby: {mean: local.mean, p: local.p, window_mb: WINDOW / 1e6},
    null_anywhere: global.null_,
    null_nearby: local.null_,
    per_domain: perDomain,
  };
})()