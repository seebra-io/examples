// Drill down into a rollout's logs: per rollout and message template, the
// lines in its before and after windows (the verdicts' bounds) as lines per
// hour, so windows of different lengths compare. "new" is a message that
// wasn't there before (none before, 3 or more after). The top 8 per rollout.
// Inputs: 0 the log lines, 1 the verdicts.
(() => {
  const [lines = [], vs = []] = Array.isArray(data) ? data : [data];
  const out = [];
  for (const v of vs) {
    if (v.before_from_ms == null) continue;
    const hb = Math.max(1e-9, (v.before_to_ms - v.before_from_ms) / 3600e3), ha = Math.max(1e-9, (v.after_to_ms - v.after_from_ms) / 3600e3);
    const m = new Map();
    for (const l of lines) {
      const w = l.t_ms > v.before_from_ms && l.t_ms <= v.before_to_ms ? "b" : l.t_ms > v.after_from_ms && l.t_ms <= v.after_to_ms ? "a" : null;
      if (!w) continue;
      if (!m.has(l.template)) m.set(l.template, { b: 0, a: 0, level: l.level, example: l.line, pods: new Set() });
      const x = m.get(l.template); x[w]++; x.pods.add(l.pod);
      if (w === "a") x.example = l.line;
    }
    const rows = [...m.entries()].map(([template, x]) => ({
      rollout: v.rollout, label: v.label, template, level: x.level, example: x.example,
      before: x.b, after: x.a, before_per_hour: x.b / hb, after_per_hour: x.a / ha,
      change: x.a / ha - x.b / hb, new: x.b === 0 && x.a >= 3, gone: x.a === 0 && x.b >= 3, pods: x.pods.size,
      from: v.before_from, to: v.after_to, sample: v.sample,
    }));
    rows.sort((p, q) => Math.abs(q.change) - Math.abs(p.change));
    out.push(...rows.slice(0, 8));
  }
  return out;
})()