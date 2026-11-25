// The usual band of each service signal (requests/s, errors, p50, p99), point
// by point over the last {{show_minutes}} min: the median of the
// {{baseline_minutes}} min before the point (robust: a spike barely moves
// it) ± {{band_k}} × 1.4826 × MAD (the median absolute deviation, scaled to
// read like a standard deviation). Points already outside the band are left
// out of later baselines, so a ten-minute incident doesn't become "usual"
// while it lasts; if most of the window is outside, all of it counts again
// (a new level is accepted). The band is never narrower than 5% of the
// median or a floor per signal (0.5 req/s, 0.1 %, 2 ms, 5 ms), so a very
// flat series doesn't flag noise. Outside: latency and errors above the
// band, traffic above or below it. `yesterday` is the same series 24 h
// earlier (the yesterday query), where Prometheus still has it.
(() => {
  const rows = Array.isArray(data) ? data : [];
  const K = Number("{{band_k}}") || 3;
  const B = (Number("{{baseline_minutes}}") || 30) * 60e3, SHOW = (Number("{{show_minutes}}") || 30) * 60e3;
  const MIN = 12;
  const floorAbs = { rate: 0.5, error_ratio: 0.1, p50: 2, p99: 5 };
  const median = (xs) => { if (!xs.length) return null; const s = Float64Array.from(xs).sort(); const i = (s.length - 1) / 2; return (s[Math.floor(i)] + s[Math.ceil(i)]) / 2; };
  const by = new Map(), yest = new Map();
  let end = -Infinity, sample = false;
  for (const r of rows) {
    if (r.group === "services") {
      const k = r.entity + "|" + r.signal;
      if (!by.has(k)) by.set(k, []);
      by.get(k).push(r);
      if (r.t_ms > end) end = r.t_ms;
      sample = sample || !!r.sample;
    } else if (r.group === "yesterday") {
      const k = r.entity + "|" + r.signal.replace(/_yesterday$/, "");
      if (!yest.has(k)) yest.set(k, []);
      yest.get(k).push(r);
    }
  }
  const from = end - SHOW;
  const out = [];
  for (const [k, pts] of by) {
    pts.sort((a, b) => a.t_ms - b.t_ms);
    const [service, signal] = k.split("|");
    const y = (yest.get(k) || []).sort((a, b) => a.t_ms - b.t_ms);
    const step = pts.length > 1 ? (pts[pts.length - 1].t_ms - pts[0].t_ms) / (pts.length - 1) : 15e3;
    const near = (t) => {
      let lo = 0, hi = y.length - 1;
      if (hi < 0) return null;
      while (lo < hi) { const m = (lo + hi) >> 1; if (y[m].t_ms < t) lo = m + 1; else hi = m; }
      const c = [y[lo], y[lo - 1]].filter(Boolean).sort((a, b) => Math.abs(a.t_ms - t) - Math.abs(b.t_ms - t))[0];
      return c && Math.abs(c.t_ms - t) <= step * 1.5 ? c.value : null;
    };
    const flagged = new Array(pts.length).fill(false);
    let lo = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      while (lo < i && pts[lo].t_ms < p.t_ms - B) lo++;
      const all = [], clean = [];
      for (let j = lo; j < i; j++) { all.push(pts[j].value); if (!flagged[j]) clean.push(pts[j].value); }
      const base = clean.length >= MIN && clean.length >= all.length / 2 ? clean : all;
      let med = null, band_lo = null, band_hi = null, side = "", outside = false, ratio = null;
      if (base.length >= MIN) {
        med = median(base);
        const mad = median(base.map((v) => Math.abs(v - med)));
        const s = Math.max(1.4826 * mad, 0.05 * Math.abs(med), floorAbs[signal] || 0);
        band_lo = Math.max(0, med - K * s);
        band_hi = med + K * s;
        side = p.value > band_hi ? "high" : p.value < band_lo ? "low" : "";
        outside = signal === "rate" ? side !== "" : side === "high";
        ratio = med > 0 ? p.value / med : null;
      }
      flagged[i] = outside;
      if (p.t_ms < from) continue;
      const yv = near(p.t_ms);
      out.push({
        service, signal, t_ms: p.t_ms, value: p.value, unit: p.unit,
        usual: med == null ? null : Number(med.toPrecision(4)), band_lo: band_lo == null ? null : Number(band_lo.toPrecision(4)),
        band_hi: band_hi == null ? null : Number(band_hi.toPrecision(4)), side, outside,
        ratio: ratio == null ? null : Number(ratio.toFixed(3)), yesterday: yv, baseline_n: base.length, namespace: "{{namespace}}", sample,
      });
    }
  }
  return out;
})()