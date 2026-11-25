// Where each thing that fills up is heading: every pod's memory against its
// limit, every volume against its capacity, every node's memory against what
// it can allocate, and each workload's CPU against its limit. A short-range
// forecast: Holt's linear exponential smoothing (a level and a trend, each
// updated per point; its two weights picked by the smallest one-step-ahead
// error over a small grid), fitted from the last drop (a restart, a
// clean-up: a fall of more than 20%) to now. If the trend is up, and clearly
// (the least-squares slope of the fit window is more than 3 standard errors
// above 0, the error widened for the points' autocorrelation), it says when
// the limit is reached, with a rough 90% range from the one-step error
// growing with √h: "memory limit reached in ~40 min (30–55 min)".
// Warnings: a pod's memory or a node's within 6 h, a volume within 48 h, CPU
// at 90% of its limit or more over the last 5 min (throttled). The rest are
// rows too (warn false), for the hover. Rough on purpose: it says what
// happens if the trend of the fit window holds, nothing more.
(() => {
  const rows = Array.isArray(data) ? data : [];
  const hm = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); };
  const dur = (ms) => { const m = ms / 60e3; return m < 90 ? `${Math.max(1, Math.round(m))} min` : m < 48 * 60 ? `${m < 600 ? (m / 60).toFixed(1).replace(/\.0$/, "") : Math.round(m / 60)} h` : `${Math.round(m / 1440)} days`; };
  // "11–12 min", "12 h–2 days"
  const range = (a, b) => { const x = dur(a), y = dur(b), ux = x.split(" ")[1], uy = y.split(" ")[1]; return ux === uy ? `${x.split(" ")[0]}–${y}` : `${x}–${y}`; };
  // the least-squares slope's t value, its error widened by the lag-1 autocorrelation of the residuals
  function slopeT(ys) {
    const n = ys.length, mx = (n - 1) / 2, my = ys.reduce((s, y) => s + y, 0) / n;
    let sxx = 0, sxy = 0;
    ys.forEach((y, i) => { sxx += (i - mx) ** 2; sxy += (i - mx) * (y - my); });
    const b = sxy / sxx, res = ys.map((y, i) => y - my - b * (i - mx));
    const s2 = res.reduce((s, e) => s + e * e, 0) / Math.max(1, n - 2);
    let num = 0;
    for (let i = 1; i < n; i++) num += res[i] * res[i - 1];
    const rho = s2 > 0 ? Math.max(0, Math.min(0.95, num / (s2 * (n - 2)))) : 0;
    const se = Math.sqrt(s2 / sxx) * Math.sqrt((1 + rho) / (1 - rho));
    return se > 0 ? b / se : b > 0 ? Infinity : 0;
  }
  const series = new Map();
  let sample = false;
  for (const r of rows) {
    const k = r.signal + "|" + r.entity + "|" + (r.pod || "");
    if (!series.has(k)) series.set(k, []);
    series.get(k).push(r);
    sample = sample || !!r.sample;
  }
  const get = (signal, entity, pod = "") => (series.get(signal + "|" + entity + "|" + pod) || []).slice().sort((a, b) => a.t_ms - b.t_ms);
  const last = (pts) => (pts.length ? pts[pts.length - 1].value : null);
  function holt(ys) {
    let best = null;
    for (const a of [0.1, 0.2, 0.3, 0.5, 0.7, 0.9]) for (const b of [0.02, 0.05, 0.1, 0.2, 0.3]) {
      let L = ys[0], T = ys[1] - ys[0], sse = 0;
      for (let i = 1; i < ys.length; i++) {
        const e = ys[i] - (L + T);
        sse += e * e;
        const L2 = a * ys[i] + (1 - a) * (L + T);
        T = b * (L2 - L) + (1 - b) * T;
        L = L2;
      }
      if (!best || sse < best.sse) best = { alpha: a, beta: b, level: L, trend: T, sse };
    }
    best.sigma = Math.sqrt(best.sse / Math.max(1, ys.length - 2));
    return best;
  }
  // when level + h·trend reaches limit, and the 90% range (z σ √h either side)
  function eta(f, limit) {
    const D = limit - f.level, T = f.trend, zs = 1.64 * f.sigma;
    if (!(T > 0) || !(D > 0)) return null;
    const h = D / T;
    const u = (s) => (s * zs + Math.sqrt(zs * zs + 4 * T * D)) / (2 * T);
    return { h, lo: u(-1) ** 2, hi: u(1) ** 2 };
  }
  function forecast(pts, limit) {
    if (pts.length < 12 || !(limit > 0)) return null;
    let from = 0;
    for (let i = 1; i < pts.length; i++) if (pts[i].value < pts[i - 1].value * 0.8) from = i;
    const fit = pts.slice(from);
    if (fit.length < 12) return { fit_from_ms: fit[0].t_ms, short: true };
    const step = (fit[fit.length - 1].t_ms - fit[0].t_ms) / (fit.length - 1);
    const f = holt(fit.map((p) => p.value));
    const rising = f.trend > 0 && slopeT(fit.map((p) => p.value)) > 3;
    const e = rising ? eta(f, limit) : null;
    const t0 = fit[fit.length - 1].t_ms;
    return {
      fit_from_ms: fit[0].t_ms, reset: from > 0, n: fit.length, step_ms: step, level: f.level, trend_per_h: f.trend * 3600e3 / step, sigma: f.sigma,
      alpha: f.alpha, beta: f.beta, rising, eta_ms: e ? t0 + e.h * step : null, eta_lo_ms: e ? t0 + e.lo * step : null, eta_hi_ms: e ? t0 + e.hi * step : null,
    };
  }
  const out = [];
  const add = (o) => out.push({ kind: "", entity: "", workload: "", used: null, limit: null, unit: "", pct: null, fit_from_ms: null, reset: false,
    level: null, trend_per_h: null, sigma: null, step_ms: null, t_last_ms: null, eta_ms: null, eta_lo_ms: null, eta_hi_ms: null, warn: false, sentence: "", sample, ...o });
  const r4 = (x) => (x == null ? null : Number(x.toPrecision(4)));
  function one({ kind, entity, workload, pts, limit, unit, within, say }) {
    if (!pts.length) return;
    const used = last(pts), f = forecast(pts, limit);
    const t_last = pts[pts.length - 1].t_ms;
    const pct = limit > 0 ? (100 * used) / limit : null;
    const soon = f && f.eta_ms != null && f.eta_ms - t_last <= within;
    const since = f && f.fit_from_ms != null ? (f.reset ? `since the drop at ${hm(f.fit_from_ms)}` : `since ${hm(f.fit_from_ms)}`) : "";
    const sentence = !(limit > 0) ? say.nolimit
      : soon ? `${say.what}: ${say.reach} in ~${dur(f.eta_ms - t_last)} (${range(f.eta_lo_ms - t_last, f.eta_hi_ms - t_last)}) if the trend ${since} holds; ${Math.round(pct)}% of ${say.limit} now`
      : f && f.rising && f.eta_ms != null && f.eta_ms - t_last <= 4 * within ? `${say.what}: ${Math.round(pct)}% of ${say.limit}, rising (${say.reach} in ~${dur(f.eta_ms - t_last)} at this trend)`
      : `${say.what}: ${Math.round(pct)}% of ${say.limit}, ${f && f.rising ? "rising slowly" : "steady"}`;
    add({ kind, entity, workload, used: r4(used), limit: r4(limit), unit, pct: pct == null ? null : Number(pct.toFixed(1)), t_last_ms: t_last,
          ...(f ? { fit_from_ms: f.fit_from_ms, reset: !!f.reset, level: r4(f.level), trend_per_h: r4(f.trend_per_h), sigma: r4(f.sigma), step_ms: f.step_ms,
                    eta_ms: f.eta_ms, eta_lo_ms: f.eta_lo_ms, eta_hi_ms: f.eta_hi_ms } : {}),
          warn: !!soon, sentence });
  }
  const H = 3600e3;
  const cores = (x) => `${Number(x.toPrecision(3))} core${x === 1 ? "" : "s"}`;
  for (const [k] of series) {
    const [signal, entity, pod] = k.split("|");
    if (signal === "pod_memory") {
      const lim = last(get("pod_memory_limits", entity, pod));
      one({ kind: "memory", entity: pod, workload: entity, pts: get("pod_memory", entity, pod), limit: lim, unit: "MiB", within: 6 * H,
            say: { what: `${entity} (pod ${pod})`, reach: "memory limit reached", limit: `its ${Math.round(lim)} MiB limit`, nolimit: `${entity} (pod ${pod}): no memory limit set, so it can take the node's memory` } });
    } else if (signal === "pvc_used") {
      const cap = last(get("pvc_capacity", entity));
      one({ kind: "disk", entity, workload: "", pts: get("pvc_used", entity), limit: cap, unit: "GiB", within: 48 * H,
            say: { what: `volume ${entity}`, reach: "disk full", limit: `${cap == null ? "?" : cap.toFixed(0)} GiB`, nolimit: `volume ${entity}: no capacity reported` } });
    } else if (signal === "node_memory") {
      const al = last(get("node_memory_allocatable", entity));
      one({ kind: "node_memory", entity, workload: "", pts: get("node_memory", entity), limit: al, unit: "GiB", within: 6 * H,
            say: { what: `node ${entity}`, reach: "allocatable memory used up", limit: `its ${al == null ? "?" : al.toFixed(1)} GiB allocatable memory`, nolimit: `node ${entity}: allocatable memory unknown` } });
    } else if (signal === "cpu") {
      const pts = get("cpu", entity), lim = last(get("cpu_limits", entity)), req = last(get("cpu_requests", entity));
      if (!pts.length) continue;
      const t_last = pts[pts.length - 1].t_ms;
      const recent = pts.filter((p) => p.t_ms > t_last - 5 * 60e3).map((p) => p.value);
      const avg = recent.reduce((s, x) => s + x, 0) / Math.max(1, recent.length);
      const pct = lim > 0 ? (100 * avg) / lim : null;
      const hot = pct != null && pct >= 90;
      add({ kind: "cpu", entity, workload: entity, used: r4(avg), limit: r4(lim), unit: "cores", pct: pct == null ? null : Number(pct.toFixed(1)), t_last_ms: t_last, warn: hot,
            sentence: !(lim > 0) ? `${entity}: CPU ${avg.toFixed(2)} cores, no limit${req > 0 ? ` (${Math.round((100 * avg) / req)}% of its request)` : ""}`
              : hot ? `${entity}: CPU at ${Math.round(pct)}% of its limit (${cores(lim)}) over the last 5 min: throttled, which slows its requests`
              : `${entity}: CPU at ${Math.round(pct)}% of its limit (${cores(lim)})` });
    }
  }
  const order = { memory: 0, disk: 1, node_memory: 2, cpu: 3 };
  out.sort((a, b) => (b.warn - a.warn) || ((a.eta_ms ?? Infinity) - (b.eta_ms ?? Infinity)) || (order[a.kind] - order[b.kind]));
  return out;
})()