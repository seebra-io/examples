// Expand: the other services' p99 (neighbours_p99_promql) in each rollout's
// windows, beside {{deployment}}'s own. Only {{deployment}} was released, so
// if the others moved as much, the cause is likely shared (load, a
// dependency, a node) rather than the release.
// Inputs: 0 the series, 1 the verdicts.
(() => {
  const [rows = [], vs = []] = Array.isArray(data) ? data : [data];
  const by = new Map();
  for (const r of rows) {
    const k = r.signal === "p99" ? r.service : r.signal === "neighbour_p99" ? r.service : null;
    if (!k) continue;
    if (!by.has(k)) by.set(k, []);
    by.get(k).push([r.t_ms, r.value]);
  }
  const med = (xs) => { const s = xs.slice().sort((a, b) => a - b); if (!s.length) return null; const i = (s.length - 1) / 2; return (s[Math.floor(i)] + s[Math.ceil(i)]) / 2; };
  const out = [];
  for (const v of vs) {
    if (v.before_from_ms == null) continue;
    for (const [service, pts] of by) {
      const b = pts.filter(([t]) => t > v.before_from_ms && t <= v.before_to_ms).map((p) => p[1]);
      const a = pts.filter(([t]) => t > v.after_from_ms && t <= v.after_to_ms).map((p) => p[1]);
      const mb = med(b), ma = med(a);
      out.push({ rollout: v.rollout, label: v.label, service, released: service === "{{deployment}}", before_ms: mb, after_ms: ma,
                 change_pct: mb && ma != null ? 100 * (ma / mb - 1) : null, n_before: b.length, n_after: a.length, sample: v.sample });
    }
  }
  return out;
})()