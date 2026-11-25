// Loki: the log rate per {{log_label}} (all lines, and those matching
// error_regex) and the newest error-ish lines, as rows of kind "rate" and
// "line". Input 0 is the rate query (a LogQL metric query: Loki answers a
// matrix, lines/s per {{log_label}} and kind); input 1 the lines query
// (streams, newest first, up to its limit). If the rate query's answer is
// lines instead (a log query, or the sample, whose one file answers both
// queries) the rate is counted from the lines per minute: at most the lines
// Loki returned, so it says so (counted_from_lines).
(() => {
  const [ra = {}, la = {}] = Array.isArray(data) ? data.map((x) => x || {}) : [data || {}, {}];
  const now = Date.now();
  const sample = !!(ra.seebra_sample || la.seebra_sample);
  const LABEL = "{{log_label}}";
  const err = new RegExp(String.raw`{{error_regex}}`.replace(/^\(\?i\)/, ""), "i");
  const clockOf = (a) => a.seebra_sample_clock;
  const retimer = (a) => {
    const c = clockOf(a);
    if (!c) return (t) => t;
    const P = c.period_s * 1000, base = Math.floor(now / P) * P - Date.parse(c.start);
    return (t) => (t + base > now ? t + base - P : t + base);
  };
  const linesOf = (a) => {
    const re = retimer(a), out = [];
    for (const s of ((a.data || {}).result) || []) {
      const st = s.stream || {};
      for (const [ns, line] of s.values || []) {
        const t = re(Math.floor(Number(String(ns).slice(0, -6))));
        const text = String(line).replace(/^\d{4}-\d\d-\d\dT[\d:.]+Z\s+/, "");
        const level = st.level || st.detected_level || ((/^(ERROR|WARN|INFO|DEBUG)\b/.exec(text) || [])[1] || "").toLowerCase();
        out.push({ t_ms: t, app: st[LABEL] || st.app || st.container || "?", pod: st.pod || st.pod_name || "", level, line: text.replace(/^(ERROR|WARN|INFO|DEBUG)\s+/, "").slice(0, 400) });
      }
    }
    return out.sort((x, y) => y.t_ms - x.t_ms);
  };
  const out = [];
  const row = (o) => out.push({ kind: "", app: "", level: "", t_ms: null, value: null, pod: "", line: "", error: false, counted_from_lines: false, sample, ...o });
  if (((ra.data || {}).resultType) === "matrix") {
    for (const s of ra.data.result || []) {
      const m = s.metric || {};
      for (const [ts, v] of s.values || []) {
        const x = Number(v);
        if (isFinite(x)) row({ kind: "rate", app: m[LABEL] || m.app || "?", level: m.kind || "all", t_ms: Math.round(Number(ts) * 1000), value: Number(x.toPrecision(4)) });
      }
    }
  } else {
    // count per minute and app from the lines
    const counts = new Map();
    for (const l of linesOf(ra)) {
      const minute = Math.ceil(l.t_ms / 60e3) * 60e3;
      for (const level of ["all", err.test(l.line) || l.level === "error" ? "error" : null]) {
        if (!level) continue;
        const k = l.app + "|" + level + "|" + minute;
        counts.set(k, (counts.get(k) || 0) + 1);
      }
    }
    const apps = new Set([...counts.keys()].map((k) => k.split("|")[0]));
    const end = Math.floor(now / 60e3) * 60e3;
    const dur = (s) => { const m = /^(\d+)(s|m|h)$/.exec(String(s).trim()); return m ? Number(m[1]) * { s: 1e3, m: 6e4, h: 36e5 }[m[2]] : 3600e3; };
    for (const app of apps) for (const level of ["all", "error"])
      for (let t = end - dur("{{window}}") + 60e3; t <= end; t += 60e3)
        row({ kind: "rate", app, level, t_ms: t, value: Number(((counts.get(app + "|" + level + "|" + t) || 0) / 60).toPrecision(4)), counted_from_lines: true });
  }
  // the sample's one file holds every line; a real lines query has only the error-ish ones
  for (const l of linesOf(la).filter((l) => !la.seebra_sample || l.level !== "info").slice(0, 1000)) row({ kind: "line", ...l, error: l.level === "error" || /\b(error|panic|fatal)\b/i.test(l.line) });
  return out;
})()