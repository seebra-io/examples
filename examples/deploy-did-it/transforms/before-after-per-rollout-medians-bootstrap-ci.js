// Did the deploy do it? For each rollout, a window before it and one after
// it ({{before_minutes}} and {{after_minutes}} min, the after window starting
// {{settle_minutes}} min in, once the new pods take the traffic), and per
// signal:
// - the medians before and after, and their difference (after − before);
// - a 95% interval for that difference: a moving-block bootstrap (blocks of
//   3 steps, 2000 resamples, seeded by the rollout), because neighbouring
//   steps are not independent (rate over 5 min, slow drifts);
// - the Mann-Whitney U test (ranks, ties shared, normal approximation with
//   a tie correction) for a p-value, and the rank-biserial r as the effect
//   size (−1 all lower after, +1 all higher after);
// - Holm's adjustment of the p99 p-values over all tested rollouts.
// Windows stop at a neighbouring rollout. Caveats: a traffic change, other
// services moving too, rollouts close together, too short a window,
// missing points, missing metrics.
// Inputs: 0 the series (signal rows), 1 the rollouts.
(() => {
  const [rows = [], rolls = []] = Array.isArray(data) ? data : [data];
  const num = (s, d) => { const x = Number(s); return s !== "" && isFinite(x) && x >= 0 ? x : d; };
  const MIN = 60e3, STEP = (() => { const m = /^(\d+)([smh])$/.exec("{{step}}".trim()); return m ? Number(m[1]) * { s: 1e3, m: 60e3, h: 3600e3 }[m[2]] : 300e3; })();
  const BEFORE = num("{{before_minutes}}", 60) * MIN, AFTER = num("{{after_minutes}}", 60) * MIN, SETTLE = num("{{settle_minutes}}", 5) * MIN;
  const NEED = 4; // points each side to test at all (4 and 4 can reach p < 0.05)
  const sample = rolls.some((r) => r.sample) || rows.some((r) => r.sample);
  const by = {}, nb = {};
  let tMin = Infinity, tMax = -Infinity;
  for (const r of rows) {
    const k = r.signal === "neighbour_p99" ? null : r.signal;
    if (k) (by[k] = by[k] || []).push([r.t_ms, r.value]);
    else (nb[r.service] = nb[r.service] || []).push([r.t_ms, r.value]);
    if (r.t_ms < tMin) tMin = r.t_ms;
    if (r.t_ms > tMax) tMax = r.t_ms;
  }
  for (const s of [by, nb]) for (const k in s) s[k].sort((a, b) => a[0] - b[0]);
  const within = (arr, a, b) => (arr || []).filter(([t]) => t > a && t <= b).map(([, v]) => v);
  const sorted = (xs) => xs.slice().sort((a, b) => a - b);
  const q = (s, p) => { if (!s.length) return NaN; const i = (s.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
  const median = (xs) => q(sorted(xs), 0.5);
  const phi = (z) => { const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2); return z >= 0 ? (1 + y) / 2 : (1 - y) / 2; };
  function mwu(b, a) {
    const all = b.map((v) => [v, 0]).concat(a.map((v) => [v, 1])).sort((x, y) => x[0] - y[0]);
    const N = all.length, ranks = new Array(N);
    let ties = 0;
    for (let i = 0; i < N;) { let j = i; while (j + 1 < N && all[j + 1][0] === all[i][0]) j++; const r = (i + j) / 2 + 1; for (let k = i; k <= j; k++) ranks[k] = r; const t = j - i + 1; ties += t * t * t - t; i = j + 1; }
    let Ra = 0; all.forEach(([, g], i) => { if (g === 1) Ra += ranks[i]; });
    const na = a.length, nb_ = b.length, U = Ra - na * (na + 1) / 2, mu = na * nb_ / 2;
    const sd = Math.sqrt(na * nb_ / 12 * ((N + 1) - ties / (N * (N - 1))));
    const z = sd > 0 ? (U - mu - Math.sign(U - mu) * 0.5) / sd : 0;
    return { U, z, p: sd > 0 ? Math.min(1, 2 * (1 - phi(Math.abs(z)))) : 1, r: 2 * U / (na * nb_) - 1 };
  }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function blockResample(xs, R, L) { const n = xs.length, out = []; while (out.length < n) { const s = Math.floor(R() * Math.max(1, n - L + 1)); for (let k = 0; k < L && out.length < n; k++) out.push(xs[Math.min(n - 1, s + k)]); } return out; }
  function ci(b, a, seed) {
    const R = rng(seed), B = 2000, L = 3, d = [];
    for (let i = 0; i < B; i++) d.push(median(blockResample(a, R, L)) - median(blockResample(b, R, L)));
    const s = sorted(d);
    return [q(s, 0.025), q(s, 0.975)];
  }
  const sg = (x) => (x > 0 ? "+" + x : x < 0 ? "−" + Math.abs(x) : "0");
  const pfmt = (p) => (p < 0.001 ? "p < 0.001" : "p = " + (p < 0.01 ? p.toFixed(3) : p < 0.1 ? p.toPrecision(2) : p.toFixed(2)));
  const known = rolls.filter((r) => r.at_ms != null).slice().sort((a, b) => a.at_ms - b.at_ms);
  const mins = (ms) => Math.round(ms / MIN);
  const res = [];
  for (const r of rolls.slice().sort((a, b) => b.rollout - a.rollout)) {
    const o = { rollout: r.rollout, label: r.label, at: r.at, at_ms: r.at_ms, from_image: r.from_image, to_image: r.to_image, rollback: r.rollback,
                replicaset: r.replicaset, pod_template_hash: r.pod_template_hash, namespace: r.namespace, deployment: r.deployment, sample };
    const caveats = [], codes = [];
    const cav = (code, text) => { codes.push(code); caveats.push(text); };
    const out = (status, reason) => Object.assign(o, { status, reason, verdict: status === "tested" ? o.verdict : "not tested",
                                                       caveats: caveats.join(" · "), caveat_codes: codes.join(",") });
    if (!rows.length) { cav("missing", "No metrics came back: check the PromQL in Parameters (p99_promql, error_ratio_promql, traffic_promql, restarts_promql) and the Prometheus datasource."); res.push(out("not tested", "no metrics")); continue; }
    if (r.at_ms == null) { res.push(out("not tested", "its time is unknown (" + r.time_from + ")")); continue; }
    if (r.at_ms - BEFORE < tMin - STEP || r.at_ms > tMax) { res.push(out("not tested", "outside the metrics' window (" + new Date(tMin).toISOString().slice(0, 16) + " to " + new Date(tMax).toISOString().slice(0, 16) + " UTC): widen window in Parameters")); continue; }
    const i = known.findIndex((x) => x.rollout === r.rollout), prev = known[i - 1], next = known[i + 1];
    let bStart = r.at_ms - BEFORE, aEnd = r.at_ms + SETTLE + AFTER;
    const bEnd = r.at_ms, aStart = r.at_ms + SETTLE;
    if (prev && prev.at_ms + SETTLE > bStart) { bStart = prev.at_ms + SETTLE; cav("close", `Rollout ${prev.rollout} came ${mins(r.at_ms - prev.at_ms)} min before: the before window is cut to ${Math.max(0, mins(bEnd - bStart))} min and still holds its settling`); }
    if (next && next.at_ms < aEnd) { aEnd = next.at_ms; cav("close", `Rollout ${next.rollout} came ${mins(next.at_ms - r.at_ms)} min after: the after window is cut to ${Math.max(0, mins(aEnd - aStart))} min`); }
    if (aEnd > tMax) { aEnd = tMax; }
    Object.assign(o, { before_from: new Date(bStart).toISOString(), before_to: new Date(bEnd).toISOString(), before_from_ms: bStart, before_to_ms: bEnd,
                       after_from: new Date(aStart).toISOString(), after_to: new Date(Math.max(aStart, aEnd)).toISOString(), after_from_ms: aStart, after_to_ms: Math.max(aStart, aEnd) });
    const get = (k) => [within(by[k], bStart, bEnd), within(by[k], aStart, aEnd)];
    const [pb, pa] = get("p99"), [eb, ea] = get("error_ratio"), [tb, ta] = get("traffic"), [rb, ra] = get("restarts");
    const expB = Math.max(0, Math.floor((bEnd - bStart) / STEP)), expA = Math.max(0, Math.floor((aEnd - aStart) / STEP));
    o.n_before = pb.length; o.n_after = pa.length;
    for (const [k, name] of [["p99", "p99_promql"], ["error_ratio", "error_ratio_promql"], ["traffic", "traffic_promql"], ["restarts", "restarts_promql"]])
      if (!(by[k] || []).length) cav("missing", `No ${k} series at all: check ${name} in Parameters`);
    if (expB + expA > 0 && (pb.length < 0.8 * expB || pa.length < 0.8 * expA) && (by.p99 || []).length)
      cav("gaps", `Missing points: ${pb.length} of ${expB} before and ${pa.length} of ${expA} after (a scrape gap or no traffic)`);
    if (pb.length < NEED || pa.length < NEED) {
      cav("short", `Too short to test: ${pb.length} points before and ${pa.length} after (it needs ${NEED} each, ${mins(NEED * STEP)} min)`);
      res.push(out("not tested", pa.length < NEED && !next && aEnd >= tMax - STEP ? "too recent: the after window isn't over yet" : "too few points"));
      continue;
    }
    if (pb.length < 10 || pa.length < 10) cav("short", `Short windows (${pb.length} and ${pa.length} points): the interval is wide and the test has little power`);
    const seed = r.rollout * 7919;
    // p99
    const m = mwu(pb, pa), [lo, hi] = ci(pb, pa, seed);
    Object.assign(o, { p99_before_ms: median(pb), p99_after_ms: median(pa), p99_change_ms: median(pa) - median(pb), p99_ci_lo_ms: lo, p99_ci_hi_ms: hi,
                       p99_change_pct: 100 * (median(pa) / median(pb) - 1), p99_U: m.U, p99_z: m.z, p99_p: m.p, p99_r: m.r });
    o.p99_verdict = m.p < 0.05 && lo > 0 ? "raised" : m.p < 0.05 && hi < 0 ? "lowered" : "no clear change";
    const ms = (x) => (Math.abs(x) >= 10 ? Math.round(x) : Number(x.toFixed(1)));
    o.p99_sentence = o.p99_verdict === "no clear change"
      ? `${r.label}: no clear change in p99 (${sg(ms(o.p99_change_ms))} ms, but the 95% CI runs from ${sg(ms(lo))} to ${sg(ms(hi))} ms), ${pfmt(m.p)}`
      : `${r.label} ${o.p99_verdict} p99 by ${Math.abs(ms(o.p99_change_ms))} ms (95% CI ${o.p99_verdict === "raised" ? ms(lo) + "–" + ms(hi) : Math.abs(ms(hi)) + "–" + Math.abs(ms(lo))}), ${pfmt(m.p)}`;
    // the error ratio (in %)
    if (eb.length >= NEED && ea.length >= NEED) {
      const e = mwu(eb, ea), [elo, ehi] = ci(eb, ea, seed + 1);
      const pct = (x) => (Math.abs(x) >= 1 ? x.toFixed(1) : Math.abs(x) >= 0.1 ? x.toFixed(2) : x.toFixed(3));
      Object.assign(o, { err_before_pct: median(eb), err_after_pct: median(ea), err_change_pts: median(ea) - median(eb), err_ci_lo_pts: elo, err_ci_hi_pts: ehi, err_p: e.p, err_r: e.r });
      o.err_verdict = e.p < 0.05 && elo > 0 ? "raised" : e.p < 0.05 && ehi < 0 ? "lowered" : "no clear change";
      o.err_sentence = o.err_verdict === "no clear change"
        ? `Errors: no clear change (${pct(median(eb))}% → ${pct(median(ea))}%, ${pfmt(e.p)})`
        : `Errors ${o.err_verdict === "raised" ? "rose" : "fell"} from ${pct(median(eb))}% to ${pct(median(ea))}% of requests (${sg(pct(o.err_change_pts))} points, 95% CI ${sg(pct(elo))} to ${sg(pct(ehi))}), ${pfmt(e.p)}`;
    } else { o.err_verdict = "not tested"; o.err_sentence = "Errors: too few points to test"; }
    // restarts: a count, compared per hour
    const sb = rb.reduce((s, x) => s + x, 0), sa = ra.reduce((s, x) => s + x, 0);
    o.restarts_before = sb; o.restarts_after = sa;
    o.restarts_sentence = `Restarts: ${Math.round(sb)} before, ${Math.round(sa)} after`;
    o.restarts_verdict = sa >= 3 && sa / ra.length > 3 * sb / Math.max(1, rb.length) + 0.05 ? "raised" : "no clear change";
    if (o.restarts_verdict === "raised") o.restarts_sentence += " (more than three times the rate before)";
    // traffic: what else changed
    if (tb.length && ta.length) {
      o.traffic_before_rps = median(tb); o.traffic_after_rps = median(ta); o.traffic_ratio = median(ta) / median(tb);
      if (o.traffic_ratio > 1.25 || o.traffic_ratio < 0.8)
        cav("traffic", `Traffic changed: ${Math.round(100 * (o.traffic_ratio - 1))}% (${Math.round(median(tb))} → ${Math.round(median(ta))} req/s): latency and errors move with load, so this is not the release alone`);
    } else cav("missing", "No traffic series: a load change can't be ruled out");
    // the neighbours: did the others move as well?
    const moved = [], nbs = Object.keys(nb);
    for (const s of nbs) {
      const b = within(nb[s], bStart, bEnd), a = within(nb[s], aStart, aEnd);
      if (b.length < NEED || a.length < NEED) continue;
      const ratio = median(a) / median(b);
      if (Math.abs(ratio - 1) > 0.1 && Math.sign(ratio - 1) === Math.sign(o.p99_change_ms) && mwu(b, a).p < 0.01) moved.push(`${s} ${ratio > 1 ? "+" : "−"}${Math.round(Math.abs(100 * (ratio - 1)))}%`);
    }
    o.neighbours_moved = moved.join(", ");
    o.neighbours_checked = nbs.length;
    if (moved.length) cav("neighbours", `Other services moved the same way (${moved.join(", ")}): a shared cause (load, a dependency, the node) is likely`);
    if (r.rollback) cav("rollback", "A rollback: it undoes the rollout before it");
    o.verdict = [o.p99_verdict, o.err_verdict, o.restarts_verdict].includes("raised") ? "worse"
      : [o.p99_verdict, o.err_verdict].includes("lowered") ? "better" : "no clear change";
    res.push(out("tested", ""));
  }
  // Holm over the tested rollouts' p99 tests
  const tested = res.filter((x) => x.status === "tested").sort((a, b) => a.p99_p - b.p99_p);
  let run = 0;
  tested.forEach((x, k) => { run = Math.max(run, Math.min(1, (tested.length - k) * x.p99_p)); x.p99_p_holm = run; x.tests = tested.length; });
  return res;
})()