// The points each rollout's verdict compared: one row per step in its
// before or after window (the bounds are the verdicts'), with every signal
// of that step side by side, and minutes from the rollout (negative before).
// Inputs: 0 the series, 1 the verdicts.
(() => {
  const [rows = [], vs = []] = Array.isArray(data) ? data : [data];
  const at = new Map();
  for (const r of rows) {
    if (r.signal === "neighbour_p99") continue;
    if (!at.has(r.t_ms)) at.set(r.t_ms, {});
    at.get(r.t_ms)[r.signal] = r.value;
  }
  const ts = [...at.keys()].sort((a, b) => a - b);
  const out = [];
  for (const v of vs) {
    if (v.before_from_ms == null) continue;
    for (const [w, a, b] of [["before", v.before_from_ms, v.before_to_ms], ["after", v.after_from_ms, v.after_to_ms]])
      for (const t of ts) {
        if (t <= a || t > b) continue;
        const x = at.get(t);
        out.push({ rollout: v.rollout, label: v.label, window: w, t: new Date(t).toISOString(), t_ms: t,
                   minutes: Math.round((t - v.at_ms) / 60e3), p99_ms: x.p99 ?? null, error_pct: x.error_ratio ?? null,
                   traffic_rps: x.traffic ?? null, restarts: x.restarts ?? null, tested: v.status === "tested", sample: v.sample });
      }
  }
  return out;
})()