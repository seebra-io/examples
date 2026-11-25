// Notes in plain words: where a service signal left its usual band (the
// band step) for {{anomaly_points}} points or more in a row (one point back
// inside doesn't end it), e.g. "p99 for checkout is 3.1× its usual level
// since 14:02". "Is … since" while it lasts (it reaches the newest point),
// "was … 14:02–14:12" once it's over. The ratio is the median over the run
// of value / usual; errors are said as their level ("at 2.8% (usual
// 0.3%)"), traffic both ways. Each note says what else moved at the same
// time (other services outside their band: a shared cause is likelier) and
// yesterday at the same time where there is one. Ongoing first, then the
// newest. A single row of kind "quiet" when nothing is outside.
(() => {
  const rows = Array.isArray(data) ? data : [];
  const MINP = Number("{{anomaly_points}}") || 3;
  const median = (xs) => { const s = xs.filter((x) => x != null && isFinite(x)).sort((a, b) => a - b); if (!s.length) return null; const i = (s.length - 1) / 2; return (s[Math.floor(i)] + s[Math.ceil(i)]) / 2; };
  const hm = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); };
  const fmt = (v, u) => u === "%" ? (v < 1 ? v.toFixed(2) : v.toFixed(1)) + "%" : u === "ms" ? Math.round(v) + " ms" : (v < 10 ? v.toFixed(1) : Math.round(v)) + " " + u;
  const label = { p99: "p99", p50: "median latency (p50)", error_ratio: "errors", rate: "traffic" };
  const by = new Map();
  let end = -Infinity, sample = false;
  for (const r of rows) {
    const k = r.service + "|" + r.signal;
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(r);
    if (r.t_ms > end) end = r.t_ms;
    sample = sample || !!r.sample;
  }
  const runs = [];
  for (const [k, pts] of by) {
    pts.sort((a, b) => a.t_ms - b.t_ms);
    const [service, signal] = k.split("|");
    const step = pts.length > 1 ? (pts[pts.length - 1].t_ms - pts[0].t_ms) / (pts.length - 1) : 15e3;
    let cur = null, gap = 0;
    const close = () => { if (cur && cur.pts.length >= MINP) runs.push(cur); cur = null; gap = 0; };
    for (const p of pts) {
      if (p.outside && cur && p.side === cur.side) { cur.pts.push(p); gap = 0; }
      else if (p.outside) { close(); cur = { service, signal, side: p.side, step, pts: [p], last: pts[pts.length - 1].t_ms }; }
      else if (cur && gap < 1 && p.usual != null) gap++;
      else close();
    }
    close();
  }
  const notes = runs.map((r) => {
    const a = r.pts[0], b = r.pts[r.pts.length - 1];
    const ongoing = b.t_ms >= r.last - 1.5 * r.step;
    const ratio = median(r.pts.map((p) => p.ratio));
    const usual = median(r.pts.map((p) => p.usual));
    const level = median(r.pts.map((p) => p.value));
    const peak = r.side === "low" ? Math.min(...r.pts.map((p) => p.value)) : Math.max(...r.pts.map((p) => p.value));
    const ys = r.pts.map((p) => p.yesterday).filter((x) => x != null);
    const yest = ys.length >= r.pts.length / 2 ? median(ys) : null;
    const mins = Math.max(1, Math.round((b.t_ms - a.t_ms + r.step) / 60e3));
    const when = ongoing ? `since ${hm(a.t_ms)}` : `${hm(a.t_ms)}–${hm(b.t_ms)} (${mins} min)`;
    const is = ongoing ? "is" : "was", are = ongoing ? "are" : "were";
    const times = (x) => x >= 1.5 ? `${x.toFixed(1)}×` : `${Math.round((x - 1) * 100)}% above`;
    let sentence;
    if (r.signal === "error_ratio") sentence = `errors for ${r.service} ${are} at ${fmt(level, "%")} of requests (usual ${fmt(usual, "%")}) ${when}`;
    else if (r.signal === "rate" && r.side === "low") sentence = `traffic to ${r.service} ${is} ${Math.round((1 - ratio) * 100)}% below its usual level ${when}`;
    else if (r.signal === "rate") sentence = `traffic to ${r.service} ${is} ${times(ratio)} its usual level ${when}`;
    else sentence = `${label[r.signal]} for ${r.service} ${is} ${times(ratio)} its usual level ${when}`;
    return { kind: "anomaly", service: r.service, signal: r.signal, side: r.side, start_ms: a.t_ms, end_ms: b.t_ms, minutes: mins, ongoing,
             ratio: ratio == null ? null : Number(ratio.toFixed(2)), level: Number(level.toPrecision(4)), usual: usual == null ? null : Number(usual.toPrecision(4)),
             peak: Number(peak.toPrecision(4)), unit: a.unit, yesterday: yest == null ? null : Number(yest.toPrecision(4)),
             yesterday_ratio: yest ? Number((level / yest).toFixed(2)) : null, points: r.pts.length, sentence, also: "", sample };
  });
  for (const n of notes) {
    const others = [...new Set(notes.filter((o) => o.service !== n.service && o.start_ms <= n.end_ms + 60e3 && o.end_ms >= n.start_ms - 60e3).map((o) => o.service))];
    n.also = others.join(", ");
    const extra = [];
    if (others.length) extra.push(`${others.join(" and ")} moved at the same time`);
    if (n.yesterday != null) extra.push(`same time yesterday: ${fmt(n.yesterday, n.unit)}`);
    n.detail = extra.join("; ");
  }
  notes.sort((p, q) => (q.ongoing - p.ongoing) || (q.end_ms - p.end_ms));
  if (!notes.length)
    return [{ kind: "quiet", service: "", signal: "", side: "", start_ms: end, end_ms: end, minutes: 0, ongoing: false, ratio: null, level: null, usual: null,
              peak: null, unit: "", yesterday: null, yesterday_ratio: null, points: 0, also: "", detail: "",
              sentence: `every service within its usual band over the last {{show_minutes}} min`, sample }];
  return notes;
})()