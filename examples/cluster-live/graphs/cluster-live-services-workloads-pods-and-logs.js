// Cluster live: every service's traffic, errors and latency with its usual
// band, every workload's CPU and memory against its requests and limits with
// a forecast, pod phases, the log rate and the volumes, redrawn on each
// refresh. Hover a point for its value, usual band, yesterday and the pods
// behind it; click a service or workload (its name, a chart or a note) to
// drill down to its pods, events and logs here; from there, expand to the
// same metric on the other services or to the nodes it runs on. What you
// chose stays when new data comes in (seebra.state).
// Inputs: 0 the band, 1 the notes, 2 the forecasts, 3 the metrics, 4 the
// cluster's pods, events and rollouts (null if Kubernetes didn't answer),
// 5 the logs (null if Loki didn't answer).
const S = (typeof seebra !== "undefined" && seebra && seebra.state) || {};
const A = (x) => (Array.isArray(x) ? x : []);
const band = A(data?.[0]), notes = A(data?.[1]), sat = A(data?.[2]), metrics = A(data?.[3]), k8s = A(data?.[4]), logs = A(data?.[5]);
const sample = [band, metrics, k8s, logs].some((a) => a.length && a[0].sample);
const NS = band[0]?.namespace || "the namespace";
const W = Math.max(760, Math.floor(fit?.width || 1180));
const C = { line: "#60a5fa", band: "#60a5fa", out: "#ef4444", yest: "#a1a1aa", roll: "#f59e0b", lim: "#ef4444", req: "#a1a1aa", fc: "#f97316", ok: "#22c55e", warn: "#f59e0b", p50: "#93c5fd", err: "#f87171", muted: "#71717a" };
const hm = d3.timeFormat("%H:%M"), hms = d3.timeFormat("%H:%M:%S");
const fmtV = (v, u) => v == null || !isFinite(v) ? "–" : u === "%" ? (v < 1 ? v.toFixed(2) : v.toFixed(1)) + "%" : u === "ms" ? Math.round(v) + " ms"
  : u === "cores" ? (v < 1 ? v.toFixed(3) : v.toFixed(2)) + " cores" : u === "MiB" ? Math.round(v) + " MiB" : u === "GiB" ? v.toFixed(1) + " GiB" : (v < 10 ? v.toFixed(1) : Math.round(v)) + (u ? " " + u : "");
const cap = (s) => String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// --- the data, indexed -----------------------------------------------------------
const tEnd = d3.max(band, (r) => r.t_ms) ?? d3.max(metrics, (r) => r.t_ms) ?? Date.now();
const tStart = d3.min(band, (r) => r.t_ms) ?? tEnd - 30 * 60e3;
const SHOW = Math.max(5 * 60e3, tEnd - tStart);
const ser = new Map();
for (const r of metrics) {
  if (r.group === "services" || r.group === "yesterday") continue;
  if (r.group !== "volumes" && r.t_ms < tStart - 60e3) continue;
  const k = r.signal + "|" + r.entity + "|" + (r.pod || "");
  if (!ser.has(k)) ser.set(k, []);
  ser.get(k).push(r);
}
for (const v of ser.values()) v.sort((a, b) => a.t_ms - b.t_ms);
const get = (signal, entity, pod = "") => ser.get(signal + "|" + entity + "|" + pod) || [];
const podsMem = (w) => [...ser.keys()].filter((k) => k.startsWith("pod_memory|" + w + "|")).map((k) => k.split("|")[2]);
const bandBy = d3.group(band, (r) => r.service, (r) => r.signal);
for (const m of bandBy.values()) for (const [k, v] of m) m.set(k, v.slice().sort((a, b) => a.t_ms - b.t_ms));
const services = [...bandBy.keys()].sort();
const workloads = [...new Set(metrics.filter((r) => r.signal === "cpu").map((r) => r.entity))].sort();
const pods = k8s.filter((r) => r.kind === "pod"), events = k8s.filter((r) => r.kind === "event"), rollouts = k8s.filter((r) => r.kind === "rollout" && r.t_ms != null);
const lines = logs.filter((r) => r.kind === "line"), rates = logs.filter((r) => r.kind === "rate");
const satBy = d3.group(sat, (r) => r.workload || r.entity);
const noteRank = (n) => (n.ongoing ? 0 : 1);
const bad = new Set([...notes.filter((n) => n.kind === "anomaly").map((n) => n.service), ...sat.filter((s) => s.warn).map((s) => s.workload || s.entity)]);
const near = (arr, t) => { if (!arr.length) return null; const i = d3.bisector((d) => d.t_ms).center(arr, t); return arr[i]; };
const podsAt = (w, t) => pods.filter((p) => p.workload === w && (p.created_ms == null || p.created_ms <= t));
const rolloutBefore = (w, t) => rollouts.filter((r) => r.workload === w && r.t_ms <= t && r.t_ms > t - 20 * 60e3).sort((a, b) => b.t_ms - a.t_ms)[0];

// --- the hover box -----------------------------------------------------------------
const wrap = d3.create("div").style("position", "relative").style("width", W + "px").style("font", "12px system-ui, sans-serif").style("color", "currentColor");
const own = wrap.append("div").style("position", "absolute").style("pointer-events", "none").style("display", "none").style("z-index", 9).style("max-width", "380px")
  .style("background", "#09090b").style("color", "#f4f4f5").style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "6px 8px");
const tip = typeof seebra !== "undefined" && seebra && seebra.tooltip;
const show = (e, html) => {
  if (tip) return tip.show(html, e);
  const r = wrap.node().getBoundingClientRect();
  own.html(html).style("display", "block").style("left", Math.min(e.clientX - r.left + 14, W - 390) + "px").style("top", e.clientY - r.top + 14 + "px");
};
const hide = () => (tip ? tip.hide() : own.style("display", "none"));
const podsHtml = (w, t) => {
  const ps = podsAt(w, t);
  if (!ps.length) return k8s.length ? `<br><span style="opacity:.7">no pod of ${esc(w)} listed for then</span>` : "";
  return `<br><span style="opacity:.75">pods: ${ps.slice(0, 6).map((p) => `${esc(p.name)} on ${esc(String(p.node).split(".")[0])}${p.restarts ? `, ${p.restarts} restarts` : ""}`).join("<br>&nbsp;&nbsp;")}${ps.length > 6 ? `<br>&nbsp;&nbsp;and ${ps.length - 6} more` : ""}</span>`;
};

// --- one small chart -----------------------------------------------------------------
// opts: {w, h, x, lines: [{pts, color, width, dash, opacity}], band: pts (band_lo/band_hi), dots: pts (red), marks: [{t, color, label}],
//        flat: [{v, color, dash, label}], fc: [{t0, v0, t1, v1}], unit, yMax, hover(t, e) -> html, click}
function small(parent, o) {
  const m = { l: 34, r: 4, t: 4, b: o.axis ? 16 : 3 };
  const svg = parent.append("svg").attr("width", o.w).attr("height", o.h + m.t + m.b).style("display", "block").style("overflow", "visible");
  const x = o.x.copy().range([m.l, o.w - m.r]);
  const vals = [...o.lines.flatMap((l) => l.pts.map((p) => p.value)), ...(o.band || []).map((p) => p.band_hi).filter((v) => v != null), ...(o.flat || []).map((f) => f.v), ...(o.fc || []).map((f) => f.v1)];
  const top = o.yMax ?? ((d3.max(vals.filter((v) => v != null && isFinite(v))) || 1) * 1.12);
  const y = d3.scaleLinear().domain([0, top]).nice(3).range([m.t + o.h, m.t]);
  svg.append("rect").attr("x", m.l).attr("y", m.t).attr("width", o.w - m.l - m.r).attr("height", o.h).attr("fill", "currentColor").attr("opacity", 0.03);
  if (o.future != null) svg.append("rect").attr("x", x(o.future)).attr("y", m.t).attr("width", Math.max(0, o.w - m.r - x(o.future))).attr("height", o.h).attr("fill", C.fc).attr("opacity", 0.06);
  const ya = svg.append("g").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(2).tickSize(3).tickFormat((v) => (Math.abs(v) >= 1000 ? d3.format("~s")(v) : d3.format("~g")(v))));
  ya.selectAll("text").attr("fill", "currentColor").attr("opacity", 0.6).style("font-size", "9px");
  ya.selectAll("line,path").attr("stroke", "currentColor").attr("stroke-opacity", 0.25);
  if (o.axis) {
    const xa = svg.append("g").attr("transform", `translate(0,${m.t + o.h})`).call(d3.axisBottom(x).ticks(Math.max(2, Math.min(10, o.w / 80))).tickSize(3).tickFormat(d3.timeFormat("%H:%M")));
    xa.selectAll("text").attr("fill", "currentColor").attr("opacity", 0.6).style("font-size", "9px");
    xa.selectAll("line,path").attr("stroke", "currentColor").attr("stroke-opacity", 0.25);
  }
  const clip = "cl" + Math.random().toString(36).slice(2);
  svg.append("clipPath").attr("id", clip).append("rect").attr("x", m.l).attr("y", m.t - 2).attr("width", o.w - m.l - m.r).attr("height", o.h + 4);
  const g = svg.append("g").attr("clip-path", `url(#${clip})`);
  // a gap (no line drawn) where points are missing: more than 2.5 of the usual step apart
  const gapSplit = (pts) => {
    const st = d3.median(pts.slice(1).map((p, i) => p.t_ms - pts[i].t_ms)) || 15e3;
    const out = [[]]; pts.forEach((p, i) => { if (i && p.t_ms - pts[i - 1].t_ms > Math.max(75e3, 2.5 * st)) out.push([]); out[out.length - 1].push(p); }); return out;
  };
  if (o.band) {
    const b = o.band.filter((p) => p.band_lo != null);
    for (const seg of gapSplit(b)) g.append("path").attr("d", d3.area().x((p) => x(p.t_ms)).y0((p) => y(p.band_lo)).y1((p) => y(p.band_hi)).curve(d3.curveStepAfter)(seg)).attr("fill", C.band).attr("opacity", 0.14);
  }
  for (const f of o.flat || []) if (f.v != null && isFinite(f.v)) g.append("line").attr("x1", m.l).attr("x2", o.w - m.r).attr("y1", y(f.v)).attr("y2", y(f.v)).attr("stroke", f.color).attr("stroke-width", 1).attr("stroke-dasharray", f.dash || "4 3").attr("opacity", 0.8);
  for (const l of o.lines) for (const seg of gapSplit(l.pts))
    g.append("path").attr("d", d3.line().x((p) => x(p.t_ms)).y((p) => y(p.value))(seg)).attr("fill", "none").attr("stroke", l.color).attr("stroke-width", l.width || 1.3)
      .attr("stroke-dasharray", l.dash || null).attr("opacity", l.opacity ?? 1);
  for (const f of o.fc || []) g.append("line").attr("x1", x(f.t0)).attr("x2", x(f.t1)).attr("y1", y(f.v0)).attr("y2", y(f.v1)).attr("stroke", C.fc).attr("stroke-width", 1.6).attr("stroke-dasharray", "2 3");
  g.selectAll("circle.out").data(o.dots || []).join("circle").attr("cx", (p) => x(p.t_ms)).attr("cy", (p) => y(p.value)).attr("r", 2.2).attr("fill", C.out);
  for (const mk of o.marks || []) {
    g.append("line").attr("x1", x(mk.t)).attr("x2", x(mk.t)).attr("y1", m.t).attr("y2", m.t + o.h).attr("stroke", mk.color || C.roll).attr("stroke-width", 1.2).attr("stroke-dasharray", mk.dash || null);
    if (mk.symbol) g.append("path").attr("d", d3.symbol(d3.symbolTriangle, 30)()).attr("transform", `translate(${x(mk.t)},${m.t + o.h - 4})`).attr("fill", mk.color || C.out);
  }
  const hair = svg.append("line").attr("y1", m.t).attr("y2", m.t + o.h).attr("stroke", "currentColor").attr("stroke-opacity", 0.4).style("display", "none").style("pointer-events", "none");
  svg.append("rect").attr("x", m.l).attr("y", m.t).attr("width", o.w - m.l - m.r).attr("height", o.h).attr("fill", "transparent").style("cursor", o.click ? "pointer" : "default")
    .on("pointermove", (e) => { const t = +x.invert(d3.pointer(e)[0]); hair.style("display", null).attr("x1", x(t)).attr("x2", x(t)); const html = o.hover && o.hover(t, e); if (html) show(e, html); })
    .on("pointerleave", () => { hair.style("display", "none"); hide(); })
    .on("click", (e) => { if (o.click) { hide(); o.click(e); } });
  return { svg, x, y };
}

// --- the views ---------------------------------------------------------------------
const xS = d3.scaleUtc().domain([tEnd - SHOW, tEnd]);
const xR = d3.scaleUtc().domain([tEnd - SHOW, tEnd + SHOW / 3]);
const go = (focus, extra = {}) => { S.focus = focus; Object.assign(S, extra); hide(); render(); };
const SIG = { rate: "requests/s", error_ratio: "errors (% of requests)", latency: "latency p50 · p99 (ms)" };
function serviceCell(parent, svc, col, w, h, axis) {
  const B = bandBy.get(svc) || new Map();
  const main = col === "latency" ? "p99" : col;
  const pts = B.get(main) || [];
  const p50 = col === "latency" ? B.get("p50") || [] : [];
  const yest = pts.filter((p) => p.yesterday != null).map((p) => ({ t_ms: p.t_ms, value: p.yesterday }));
  return small(parent, {
    w, h, x: xS, axis, band: pts,
    lines: [...(yest.length ? [{ pts: yest, color: C.yest, dash: "3 3", width: 1, opacity: 0.8 }] : []), ...(p50.length ? [{ pts: p50, color: C.p50, width: 1, opacity: 0.8 }] : []), { pts, color: col === "error_ratio" ? C.err : C.line }],
    dots: [...pts.filter((p) => p.outside), ...p50.filter((p) => p.outside)],
    marks: rollouts.filter((r) => r.workload === svc && r.t_ms >= tEnd - SHOW).map((r) => ({ t: r.t_ms, color: C.roll })),
    click: () => go(svc),
    hover: (t, e) => {
      const rows = (col === "latency" ? ["p99", "p50"] : [main]).map((s) => [s, near(B.get(s) || [], t)]).filter(([, p]) => p);
      if (!rows.length) return null;
      const p0 = rows[0][1];
      const r = rolloutBefore(svc, p0.t_ms);
      return `<b>${esc(svc)}</b> · ${hms(new Date(p0.t_ms))}<br>` + rows.map(([s, p]) =>
        `${s === "rate" ? "requests" : s === "error_ratio" ? "errors" : s} <b>${fmtV(p.value, p.unit)}</b>` +
        (p.usual != null ? ` · usual ${fmtV(p.usual, p.unit)} (band ${fmtV(p.band_lo, p.unit)}–${fmtV(p.band_hi, p.unit)})` : " · no band yet (needs 12 earlier points)") +
        (p.ratio != null ? ` · ${p.ratio.toFixed(2)}×` : "") + (p.outside ? ` <span style="color:${C.out}">outside</span>` : "") +
        (p.yesterday != null ? `<br>&nbsp;&nbsp;same time yesterday ${fmtV(p.yesterday, p.unit)}` : "")).join("<br>") +
        (r ? `<br><span style="color:${C.roll}">${Math.round((p0.t_ms - r.t_ms) / 60e3)} min after ${esc(r.label)}</span>` : "") +
        podsHtml(svc, p0.t_ms) + `<br><span style="opacity:.6">Click: drill down into ${esc(svc)}'s pods, events and logs</span>`;
    },
  });
}
function restartsOf(w) {
  const pts = get("restarts_total", w), out = [];
  for (let i = 1; i < pts.length; i++) if (pts[i].value > pts[i - 1].value) out.push({ t: pts[i].t_ms, n: pts[i].value - pts[i - 1].value });
  return out;
}
function cpuCell(parent, wl, w, h, axis) {
  const pts = get("cpu", wl), req = get("cpu_requests", wl).at(-1)?.value, lim = get("cpu_limits", wl).at(-1)?.value;
  const s = (satBy.get(wl) || []).find((r) => r.kind === "cpu");
  return small(parent, {
    w, h, x: xR, axis, future: tEnd,
    lines: [{ pts, color: s && s.warn ? C.out : C.line }],
    flat: [{ v: req, color: C.req }, { v: lim, color: C.lim }],
    click: () => go(wl),
    hover: (t) => {
      const p = near(pts, t);
      if (!p) return null;
      return `<b>${esc(wl)}</b> CPU · ${hms(new Date(p.t_ms))}<br>used <b>${fmtV(p.value, "cores")}</b>` + (req ? ` · request ${fmtV(req, "cores")} (${Math.round((100 * p.value) / req)}%)` : " · no request") +
        (lim ? ` · limit ${fmtV(lim, "cores")} (${Math.round((100 * p.value) / lim)}%)` : " · no limit") + (s ? `<br>${esc(cap(s.sentence))}` : "") + podsHtml(wl, p.t_ms) +
        `<br><span style="opacity:.6">dashed: request (grey), limit (red). At its limit a container is throttled. Click to drill down.</span>`;
    },
  });
}
function memCell(parent, wl, w, h, axis) {
  const ps = podsMem(wl);
  const series = ps.map((p) => ({ pod: p, pts: get("pod_memory", wl, p), lim: get("pod_memory_limits", wl, p).at(-1)?.value, f: (satBy.get(wl) || []).find((r) => r.kind === "memory" && r.entity === p) }));
  const lim = d3.max(series, (s) => s.lim), req = get("memory_requests", wl).at(-1)?.value / Math.max(1, ps.length);
  const fc = series.filter((s) => s.f && s.f.level != null && s.f.trend_per_h > 0 && (s.f.warn || s.f.eta_ms != null)).map((s) => {
    const t1 = Math.min(tEnd + SHOW / 3, s.f.eta_ms ?? Infinity), dt = (t1 - s.f.t_last_ms) / 3600e3;
    return { t0: s.f.t_last_ms, v0: s.f.level, t1, v1: s.f.level + s.f.trend_per_h * dt };
  });
  const rs = restartsOf(wl);
  return small(parent, {
    w, h, x: xR, axis, future: tEnd, fc,
    lines: series.map((s) => ({ pts: s.pts, color: s.f && s.f.warn ? C.fc : C.line, width: 1.1, opacity: 0.9 })),
    flat: [{ v: req || null, color: C.req }, { v: lim, color: C.lim }],
    marks: rs.map((r) => ({ t: r.t, color: C.out, dash: "2 2", symbol: true })),
    click: () => go(wl),
    hover: (t) => {
      const rows = series.map((s) => [s, near(s.pts, t)]).filter(([, p]) => p);
      if (!rows.length) return null;
      const t0 = rows[0][1].t_ms;
      const rr = rs.filter((r) => Math.abs(r.t - t) < 60e3);
      return `<b>${esc(wl)}</b> memory per pod · ${t > tEnd ? "forecast" : hms(new Date(t0))}<br>` +
        rows.map(([s, p]) => `${esc(s.pod)}: <b>${fmtV(p.value, "MiB")}</b>${s.lim ? ` of ${fmtV(s.lim, "MiB")} (${Math.round((100 * p.value) / s.lim)}%)` : ", no limit"}`).join("<br>") +
        series.filter((s) => s.f && (s.f.warn || /rising/.test(s.f.sentence))).map((s) => `<br><span style="color:${C.fc}">${esc(cap(s.f.sentence))}</span>`).join("") +
        (rr.length ? `<br><span style="color:${C.out}">▲ restarted here (${rr.map((r) => r.n).join("+")})${pods.some((p) => p.workload === wl && /OOMKilled/.test(p.reason)) ? ": OOMKilled" : ""}</span>` : "") +
        `<br><span style="opacity:.6">dashed: request per pod (grey), limit (red); dotted orange: the forecast if the trend holds. Click to drill down.</span>`;
    },
  });
}

let body = null;
function header() {
  const h = wrap.append("div").style("display", "flex").style("gap", "8px").style("align-items", "center").style("flex-wrap", "wrap").style("margin-bottom", "6px");
  if (sample) h.append("span").attr("title", "Made up by a model (scripts/cluster-live-sample.mjs) in the exact shapes of the Prometheus, Kubernetes and Loki APIs, moving with the clock. Connect your cluster (the button) to run on yours.")
    .style("background", "#f59e0b").style("color", "#000").style("font-weight", 700).style("padding", "2px 8px").style("border-radius", "4px").style("cursor", "help").text("SAMPLE DATA: connect your cluster to run on yours");
  h.append("span").style("font-weight", 600).text(`${NS}: ${services.length} services, ${workloads.length} workloads`);
  h.append("span").style("opacity", 0.7).text(`newest point ${hms(new Date(tEnd))} · live, refreshed by the board's timer`);
  const chip = (name, ok, why) => h.append("span").attr("title", why).style("border", `1px solid ${ok ? C.ok : C.out}`).style("color", ok ? C.ok : C.out).style("border-radius", "10px").style("padding", "0 7px").style("font-size", "11px").text(`${name} ${ok ? "✓" : "✗"}`);
  chip("Prometheus", band.length > 0, band.length ? "answered" : "no request metrics: check the services query and its PromQL in Parameters");
  chip("Kubernetes", data?.[4] != null, data?.[4] != null ? "answered" : "no answer: pods, events and deploy markers are missing. Check the Kubernetes datasource (kubectl proxy needs a CORS proxy in a browser)");
  chip("Loki", data?.[5] != null, data?.[5] != null ? "answered" : "no answer: the log rate and lines are missing. Check the Loki datasource");
  h.append("button").text(S.connect ? "Hide how to connect" : "Connect your cluster").style("font", "inherit").style("padding", "1px 8px").style("border", "1px solid #71717a").style("border-radius", "4px")
    .style("background", "transparent").style("color", "inherit").style("cursor", "pointer").on("click", () => { S.connect = !S.connect; render(); });
  if (S.connect) wrap.append("div").style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "8px 10px").style("margin-bottom", "8px").style("max-width", W - 20 + "px").style("line-height", "1.45").html(
    `<b>Point the board at your cluster</b> (read only: nothing here writes). Set the three datasources' URLs, then <i>namespace</i> in Parameters.` +
    `<ol style="margin:4px 0 4px 18px;padding:0">` +
    `<li><b>The desktop app</b> reads localhost straight away: <code>kubectl port-forward -n monitoring svc/prometheus-operated 9090</code>, <code>kubectl port-forward -n monitoring svc/loki 3100</code>, <code>kubectl proxy --port=8001</code>; then Prometheus <code>http://localhost:9090/api/v1</code>, Kubernetes <code>http://localhost:8001</code>, Loki <code>http://localhost:3100/loki/api/v1</code>.</li>` +
    `<li><b>Your organisation's gateway</b> (in the cluster, Settings › Organization): Kubernetes <code>https://kubernetes.default.svc</code> with a read-only token, your Prometheus or Thanos querier (OpenShift: <code>https://thanos-querier.openshift-monitoring.svc:9091/api/v1</code>, bearer token) and Loki.</li>` +
    `<li><b>In a browser</b>, the same localhost URLs behind a proxy that adds CORS headers for this site (kubectl proxy and Loki send none; Prometheus can: <code>--web.cors.origin</code>).</li></ol>` +
    `The PromQL defaults follow kube-prometheus-stack (cAdvisor, kube-state-metrics, its recording rules) and OpenTelemetry's <code>http_server_request_duration_seconds</code> for requests, which your apps export. Different names: edit them in Parameters (each panel's query is one parameter). ` +
    `A chip above turns red when a source doesn't answer.`);
}
function noteList() {
  const items = [
    ...notes.filter((n) => n.kind === "anomaly").map((n) => ({ who: n.service, color: n.ongoing ? C.out : C.warn, text: n.sentence, detail: n.detail, rank: noteRank(n) })),
    ...sat.filter((s) => s.warn).map((s) => ({ who: s.workload || s.entity, color: C.fc, text: s.sentence, detail: "", rank: 0.5 })),
  ].sort((a, b) => a.rank - b.rank);
  const box = wrap.append("div").style("margin", "2px 0 8px");
  if (!items.length) {
    box.append("div").style("opacity", 0.8).html(`<span style="color:${C.ok}">●</span> ${band.length ? `Every service within its usual band over the last ${Math.round(SHOW / 60e3)} min, and nothing heading for a limit.` : "No service metrics yet."}`);
    return;
  }
  for (const it of items.slice(0, 7)) {
    const kind = it.kind;
    box.append("div").style("cursor", "pointer").style("padding", "1px 0").attr("title", `Click: drill down into ${it.who}`)
      .html(`<span style="color:${it.color}">●</span> ${esc(cap(it.text))}${it.detail ? ` <span style="opacity:.65">(${esc(it.detail)})</span>` : ""}`)
      .on("click", () => go(it.who));
  }
  if (items.length > 7) box.append("div").style("opacity", 0.6).text(`and ${items.length - 7} more: the Notes and Forecasts tables`);
}
function section(title, sub) {
  const s = wrap.append("div").style("margin-top", "10px");
  s.append("div").style("font-weight", 600).style("margin-bottom", "2px").html(`${esc(title)} <span style="font-weight:400;opacity:.6">${sub}</span>`);
  return s;
}
function nameCell(row, name, sub) {
  row.append("div").style("width", "96px").style("flex", "none").style("cursor", "pointer").style("overflow", "hidden").style("text-overflow", "ellipsis").attr("title", `Drill down into ${name}`)
    .html(`<span style="color:${bad.has(name) ? C.out : "inherit"};text-decoration:underline dotted">${esc(name)}</span><br><span style="opacity:.55;font-size:10px">${sub || ""}</span>`)
    .on("click", () => go(name));
}
function overview() {
  const cols = ["rate", "error_ratio", "latency"];
  const cw = Math.floor((W - 100 - 3 * 8) / 3);
  const s1 = section("Services", `· the last ${Math.round(SHOW / 60e3)} min · band: usual (median of the 30 min before ± 3·MAD) · red dots: outside · grey dashed: yesterday · amber: a rollout`);
  const hr = s1.append("div").style("display", "flex").style("gap", "8px").style("padding-left", "100px");
  cols.forEach((c) => hr.append("div").style("width", cw + "px").style("opacity", 0.7).text(SIG[c]));
  services.forEach((svc, i) => {
    const row = s1.append("div").style("display", "flex").style("gap", "8px").style("align-items", "flex-start");
    const n = (bandBy.get(svc).get("rate") || []).at(-1);
    nameCell(row, svc, n ? fmtV(n.value, "req/s") : "");
    cols.forEach((c) => serviceCell(row.append("div"), svc, c, cw, 46, i === services.length - 1));
  });
  const ww = Math.floor((W - 100 - 8) / 2);
  const s2 = section("Workloads", "· CPU (cores) and memory per pod (MiB) against request (grey) and limit (red) · ▲ a restart · right of now: the forecast");
  const hr2 = s2.append("div").style("display", "flex").style("gap", "8px").style("padding-left", "100px");
  ["CPU (cores)", "memory per pod (MiB)"].forEach((c) => hr2.append("div").style("width", ww + "px").style("opacity", 0.7).text(c));
  workloads.forEach((wl, i) => {
    const row = s2.append("div").style("display", "flex").style("gap", "8px");
    const ps = pods.filter((p) => p.workload === wl);
    nameCell(row, wl, ps.length ? `${ps.length} pod${ps.length > 1 ? "s" : ""}${ps.some((p) => p.restarts) ? `, ${d3.sum(ps, (p) => p.restarts)} restarts` : ""}` : "");
    cpuCell(row.append("div"), wl, ww, 40, i === workloads.length - 1);
    memCell(row.append("div"), wl, ww, 40, i === workloads.length - 1);
  });
  const bw = Math.floor((W - 2 * 10) / 3);
  const s3 = section("Pods, logs and volumes", "");
  const row = s3.append("div").style("display", "flex").style("gap", "10px");
  phasesCell(row.append("div"), bw);
  logCell(row.append("div"), bw, null);
  volumeCell(row.append("div"), bw);
}
function phasesCell(parent, w) {
  parent.append("div").style("opacity", 0.7).text("pods by phase");
  const ph = ["Running", "Pending", "Failed", "Succeeded", "Unknown"].map((p) => [p, get("pods", p)]).filter(([, v]) => v.length);
  const col = { Running: C.ok, Pending: C.warn, Failed: C.out, Succeeded: C.muted, Unknown: "#a78bfa" };
  return small(parent, {
    w, h: 60, x: xS, axis: true, lines: ph.map(([p, v]) => ({ pts: v, color: col[p], width: 1.4 })),
    hover: (t) => { const r = ph.map(([p, v]) => [p, near(v, t)]).filter(([, x]) => x); return r.length ? `<b>pods by phase</b> · ${hms(new Date(r[0][1].t_ms))}<br>` + r.map(([p, x]) => `${p}: <b>${x.value}</b>`).join(" · ") + `<br><span style="opacity:.6">kube_pod_status_phase. Pending that stays: look at the events (scheduling, image pulls).</span>` : null; },
  });
}
function logCell(parent, w, only) {
  parent.append("div").style("opacity", 0.7).text(only ? `${only}: log lines/s (red: errors)` : "log lines/s per app (red: errors, all apps)");
  if (data?.[5] == null) { parent.append("div").style("opacity", 0.7).style("width", w + "px").text("Loki didn't answer: check its datasource (it sends no CORS headers: the desktop app, the gateway or a CORS proxy)."); return; }
  const apps = d3.group(rates.filter((r) => r.level === "all" && (!only || r.app === only)), (r) => r.app);
  const errs = d3.rollups(rates.filter((r) => r.level === "error" && (!only || r.app === only)), (v) => d3.sum(v, (r) => r.value), (r) => r.t_ms).map(([t, v]) => ({ t_ms: t, value: v })).sort((a, b) => a.t_ms - b.t_ms);
  const palette = d3.schemeTableau10;
  const appList = [...apps.keys()].sort();
  const counted = rates.some((r) => r.counted_from_lines);
  return small(parent, {
    w, h: 60, x: xS, axis: true,
    lines: [...appList.map((a, i) => ({ pts: apps.get(a).slice().sort((p, q) => p.t_ms - q.t_ms), color: palette[i % 10], width: 1.1, opacity: 0.85 })), { pts: errs, color: C.out, width: 1.6 }],

    hover: (t) => {
      const r = appList.map((a, i) => [a, near(apps.get(a).slice().sort((p, q) => p.t_ms - q.t_ms), t), palette[i % 10]]).filter(([, x]) => x);
      const er = near(errs, t);
      return r.length ? `<b>log lines/s</b> · ${hm(new Date(r[0][1].t_ms))}<br>` + r.map(([a, x, c]) => `<span style="color:${c}">●</span> ${esc(a)} ${x.value.toFixed(2)}`).join("<br>") +
        (er ? `<br><span style="color:${C.out}">errors ${er.value.toFixed(2)}/s</span>` : "") + (counted ? `<br><span style="opacity:.6">counted from the lines Loki returned (at most its limit)</span>` : "") : null;
    },
  });
}
function volumeCell(parent, w) {
  parent.append("div").style("opacity", 0.7).text("volumes: % used (dotted: forecast)");
  const vs = sat.filter((s) => s.kind === "disk");
  const pvcs = [...new Set(metrics.filter((r) => r.signal === "pvc_used").map((r) => r.entity))];
  if (!pvcs.length) { parent.append("div").style("opacity", 0.7).style("width", w + "px").text("No volume stats (kubelet_volume_stats_*) for this namespace."); return; }
  const xv = d3.scaleUtc().domain([d3.min(metrics.filter((r) => r.group === "volumes"), (r) => r.t_ms), tEnd + 3 * 3600e3]);
  const pct = (p) => pvcs.map((v) => { const used = get("pvc_used", v), capy = get("pvc_capacity", v).at(-1)?.value; return { v, capy, pts: used.map((u) => ({ t_ms: u.t_ms, value: capy ? (100 * u.value) / capy : null })).filter((u) => u.value != null) }; });
  const ss = pct();
  const fc = vs.filter((s) => s.level != null && s.trend_per_h > 0 && s.limit).map((s) => { const t1 = Math.min(tEnd + 3 * 3600e3, s.eta_ms ?? Infinity); return { t0: s.t_last_ms, v0: (100 * s.level) / s.limit, t1, v1: (100 * (s.level + (s.trend_per_h * (t1 - s.t_last_ms)) / 3600e3)) / s.limit }; });
  return small(parent, {
    w, h: 60, x: xv, axis: true, yMax: 100, future: tEnd, fc,
    lines: ss.map((s, i) => ({ pts: s.pts, color: vs.find((x) => x.entity === s.v && x.warn) ? C.fc : d3.schemeTableau10[(i + 4) % 10], width: 1.3 })),
    flat: [{ v: 100, color: C.lim, dash: "2 2" }],
    hover: (t) => { const r = ss.map((s) => [s, near(s.pts, t)]).filter(([, x]) => x); return r.length ? `<b>volumes</b> · ${hm(new Date(r[0][1].t_ms))}<br>` + r.map(([s, x]) => `${esc(s.v)}: <b>${x.value.toFixed(1)}%</b> of ${fmtV(s.capy, "GiB")}`).join("<br>") + vs.map((s) => `<br><span style="color:${s.warn ? C.fc : "inherit"}">${esc(cap(s.sentence))}</span>`).join("") : null; },
  });
}

// --- drill down: one workload's pods, events and logs; expand: wider --------------------
function drill(name) {
  const bar = wrap.append("div").style("display", "flex").style("gap", "8px").style("align-items", "center").style("margin", "4px 0 6px");
  const btn = (p, label, on, active) => p.append("button").text(label).style("font", "inherit").style("padding", "1px 8px").style("border", `1px solid ${active ? C.line : "#71717a"}`).style("border-radius", "4px")
    .style("background", active ? "rgba(96,165,250,.15)" : "transparent").style("color", "inherit").style("cursor", "pointer").on("click", on);
  btn(bar, "← the whole namespace", () => go(null, { expand: null }));
  bar.append("span").style("font-weight", 700).style("font-size", "14px").text(`${name}: drill down`);
  bar.append("span").style("opacity", 0.6).text("its signals, pods, events and logs");
  const said = [...notes.filter((n) => n.kind === "anomaly" && n.service === name).map((n) => [n.ongoing ? C.out : C.warn, n.sentence + (n.detail ? ` (${n.detail})` : "")]),
                ...(satBy.get(name) || []).filter((s) => s.warn || /rising|throttled/.test(s.sentence)).map((s) => [C.fc, s.sentence])];
  const sb = wrap.append("div");
  for (const [c, t] of said) sb.append("div").html(`<span style="color:${c}">●</span> ${esc(cap(t))}`);
  if (!said.length) sb.append("div").style("opacity", 0.75).html(`<span style="color:${C.ok}">●</span> Nothing outside its usual band, nothing heading for a limit.`);
  const r = rolloutBefore(name, tEnd + 1) || rollouts.filter((x) => x.workload === name).sort((a, b) => b.t_ms - a.t_ms)[0];
  if (r) sb.append("div").style("opacity", 0.8).html(`<span style="color:${C.roll}">●</span> latest rollout: ${esc(r.label)}, ${hm(new Date(r.t_ms))} · <a href="https://www.seebra.io/?example=deploy-did-it" target="_blank" style="color:${C.line}">Did the deploy do it?</a> gives each rollout a verdict`);
  const has = bandBy.has(name), isW = workloads.includes(name);
  const cw = Math.floor((W - 3 * 10) / (has ? 3 : 1));
  if (has) {
    const s = section("Signals", "· hover for the band, yesterday and the pods");
    const row = s.append("div").style("display", "flex").style("gap", "10px");
    for (const c of ["rate", "error_ratio", "latency"]) { const d = row.append("div"); d.append("div").style("opacity", 0.7).text(SIG[c]); serviceCell(d, name, c, cw, 80, true); }
  }
  if (isW) {
    const s = section("Resources", "· right of now: the forecast if the trend holds");
    const row = s.append("div").style("display", "flex").style("gap", "10px");
    const ww = Math.floor((W - 10) / 2);
    const a = row.append("div"); a.append("div").style("opacity", 0.7).text("CPU (cores)"); cpuCell(a, name, ww, 80, true);
    const b = row.append("div"); b.append("div").style("opacity", 0.7).text("memory per pod (MiB)"); memCell(b, name, ww, 80, true);
  }
  // pods
  const ps = pods.filter((p) => p.workload === name);
  const s1 = section("Pods", data?.[4] == null ? "· Kubernetes didn't answer" : `· ${ps.length} now`);
  if (ps.length) {
    const t = s1.append("table").style("border-collapse", "collapse").style("font-size", "11px");
    const tr = t.append("tr");
    ["pod", "node", "phase", "ready", "restarts", "last stop", "age", "image"].forEach((h) => tr.append("th").style("text-align", "left").style("padding", "1px 8px 1px 0").style("opacity", 0.6).text(h));
    for (const p of ps) {
      const f = (satBy.get(name) || []).find((s) => s.kind === "memory" && s.entity === p.name);
      const row = t.append("tr").on("pointermove", (e) => f && show(e, esc(cap(f.sentence)))).on("pointerleave", hide);
      [p.name, String(p.node).split(".")[0], p.phase, p.ready ? "yes" : "no", p.restarts, p.reason + (p.last_stop_ms ? ` at ${hm(new Date(p.last_stop_ms))}` : ""),
       p.created_ms ? d3.format(".0f")((tEnd - p.created_ms) / 3600e3) + " h" : "", String(p.image).replace(/^.*\//, "")].forEach((v, i) =>
        row.append("td").style("padding", "1px 8px 1px 0").style("color", (i === 4 && p.restarts) || (i === 5 && /OOM/.test(v)) ? C.out : i === 3 && !p.ready ? C.warn : null).text(v ?? ""));
    }
  }
  // events and logs side by side
  const two = wrap.append("div").style("display", "flex").style("gap", "16px").style("margin-top", "10px");
  const ev = two.append("div").style("width", Math.floor(W * 0.45) + "px");
  ev.append("div").style("font-weight", 600).text("Events").append("span").style("font-weight", 400).style("opacity", 0.6).text(" · newest first; they expire (an hour by default)");
  const mine = events.filter((e) => e.workload === name).sort((a, b) => b.t_ms - a.t_ms).slice(0, 14);
  if (!mine.length) ev.append("div").style("opacity", 0.7).text(data?.[4] == null ? "Kubernetes didn't answer." : "No events left for it.");
  for (const e of mine) ev.append("div").style("padding", "1px 0").html(`<span style="opacity:.6">${hm(new Date(e.t_ms))}</span> <span style="color:${e.type === "Warning" ? C.warn : C.muted}">${esc(e.reason)}</span>${e.count > 1 ? ` ×${e.count}` : ""} <span style="opacity:.75">${esc(e.object_kind)}/${esc(e.name)}</span>: ${esc(e.message)}`);
  const lg = two.append("div").style("width", Math.floor(W * 0.52) + "px");
  lg.append("div").style("font-weight", 600).text("Logs").append("span").style("font-weight", 400).style("opacity", 0.6).text(" · the newest error-ish lines (logs_logql)");
  logCell(lg, Math.floor(W * 0.5), name);
  const ml = lines.filter((l) => l.app === name).slice(0, 25);
  if (data?.[5] != null && !ml.length) lg.append("div").style("opacity", 0.7).text("No error-ish lines in the window.");
  for (const l of ml) lg.append("div").style("font", "11px ui-monospace, monospace").style("white-space", "nowrap").style("overflow", "hidden").style("text-overflow", "ellipsis").attr("title", l.line)
    .html(`<span style="opacity:.6">${hms(new Date(l.t_ms))}</span> <span style="color:${l.level === "error" ? C.out : l.level === "warn" ? C.warn : C.muted}">${esc(l.level || "")}</span> ${esc(l.line)}`);
  // expand
  const ex = section("Expand", "· wider: the same metric on the other services, and the nodes it runs on");
  const eb = ex.append("div").style("display", "flex").style("gap", "8px").style("margin-bottom", "4px");
  if (has) btn(eb, "Same metric on the other services", () => { S.expand = S.expand === "services" ? null : "services"; render(); }, S.expand === "services");
  btn(eb, "The nodes it runs on", () => { S.expand = S.expand === "nodes" ? null : "nodes"; render(); }, S.expand === "nodes");
  if (S.expand === "services" && has) expandServices(ex, name);
  if (S.expand === "nodes") expandNodes(ex, name);
}
function expandServices(parent, name) {
  const metric = S.metric || "p99";
  const mb = parent.append("div").style("display", "flex").style("gap", "6px").style("margin", "2px 0");
  for (const [m, l] of [["p99", "p99"], ["p50", "p50"], ["error_ratio", "errors"], ["rate", "requests/s"]])
    mb.append("button").text(l).style("font", "inherit").style("padding", "0 6px").style("border", `1px solid ${m === metric ? C.line : "#52525b"}`).style("border-radius", "4px")
      .style("background", "transparent").style("color", "inherit").style("cursor", "pointer").on("click", () => { S.metric = m; render(); });
  parent.append("div").style("opacity", 0.7).text(`${metric === "rate" ? "requests/s" : metric} of every service as a multiple of its own usual level (1 = usual). If the others moved with ${name}, the cause is likely shared: traffic, a dependency, the nodes.`);
  const ss = services.map((s, i) => ({ s, pts: (bandBy.get(s).get(metric) || []).filter((p) => p.ratio != null).map((p) => ({ t_ms: p.t_ms, value: p.ratio, p })), color: s === name ? C.out : d3.schemeTableau10[i % 10] }));
  small(parent, {
    w: W - 10, h: 110, x: xS, axis: true, flat: [{ v: 1, color: C.muted, dash: "1 2" }],
    lines: ss.map((x) => ({ pts: x.pts, color: x.color, width: x.s === name ? 2 : 1.1, opacity: x.s === name ? 1 : 0.8 })),
    hover: (t) => { const r = ss.map((x) => [x, near(x.pts, t)]).filter(([, p]) => p); return r.length ? `<b>${metric} vs usual</b> · ${hms(new Date(r[0][1].t_ms))}<br>` + r.map(([x, p]) => `<span style="color:${x.color}">●</span> ${esc(x.s)} <b>${p.value.toFixed(2)}×</b> (${fmtV(p.p.value, p.p.unit)}, usual ${fmtV(p.p.usual, p.p.unit)})${p.p.outside ? ` <span style="color:${C.out}">outside</span>` : ""}`).join("<br>") + `<br><span style="opacity:.6">click a service's name above, or here, to drill down into it</span>` : null; },

  });
  const leg = parent.append("div").style("display", "flex").style("gap", "10px").style("flex-wrap", "wrap");
  for (const x of ss) leg.append("span").style("cursor", "pointer").html(`<span style="color:${x.color}">●</span> ${esc(x.s)}`).on("click", () => go(x.s));
}
function expandNodes(parent, name) {
  const ps = pods.filter((p) => p.workload === name);
  const nodes = [...new Set(ps.map((p) => p.node).filter(Boolean))];
  if (!nodes.length) { parent.append("div").style("opacity", 0.7).text(data?.[4] == null ? "Kubernetes didn't answer: which nodes its pods run on is unknown." : "None of its pods is placed on a node."); return; }
  const nw = Math.floor((W - 10) / 2);
  for (const n of nodes) {
    const box = parent.append("div").style("margin", "6px 0");
    const here = pods.filter((p) => p.node === n);
    const ns = sat.filter((s) => s.kind === "node_memory" && s.entity === n)[0];
    box.append("div").html(`<b>${esc(n)}</b> <span style="opacity:.7">· ${here.length} pods of ${esc(NS)} here: ${here.map((p) => `<span style="color:${p.workload === name ? C.line : "inherit"}">${esc(p.name)}</span>`).join(", ")}</span>` + (ns ? `<br><span style="color:${ns.warn ? C.fc : "inherit"};opacity:.85">${esc(cap(ns.sentence))}</span>` : ""));
    const row = box.append("div").style("display", "flex").style("gap", "10px");
    const cpu = get("node_cpu", n), cpuA = get("node_cpu_allocatable", n).at(-1)?.value, mem = get("node_memory", n), memA = get("node_memory_allocatable", n).at(-1)?.value;
    if (!cpu.length && !mem.length) { row.append("div").style("opacity", 0.7).text("No node metrics (the node_namespace_pod_container recording rules of kube-prometheus-stack)."); continue; }
    const hov = (pts, a, u, what) => (t) => { const p = near(pts, t); return p ? `<b>${esc(n)}</b> ${what} · ${hms(new Date(p.t_ms))}<br><b>${fmtV(p.value, u)}</b>${a ? ` of ${fmtV(a, u)} allocatable (${Math.round((100 * p.value) / a)}%)` : ""}<br><span style="opacity:.6">all pods on the node, every namespace</span>` : null; };
    const a = row.append("div"); a.append("div").style("opacity", 0.7).text("CPU (cores) vs allocatable"); small(a, { w: nw, h: 50, x: xS, axis: true, lines: [{ pts: cpu, color: C.line }], flat: [{ v: cpuA, color: C.lim }], hover: hov(cpu, cpuA, "cores", "CPU") });
    const b = row.append("div"); b.append("div").style("opacity", 0.7).text("memory (GiB) vs allocatable"); small(b, { w: nw, h: 50, x: xS, axis: true, lines: [{ pts: mem, color: C.line }], flat: [{ v: memA, color: C.lim }], hover: hov(mem, memA, "GiB", "memory") });
  }
}
function render() {
  wrap.selectAll(":scope > *:not(:first-child)").remove();
  header();
  if (!band.length && !metrics.length) {
    wrap.append("p").style("max-width", W - 20 + "px").text("No metrics came back. Check the Prometheus datasource and the PromQL in Parameters (a typo in one signal leaves its whole query empty; Prometheus' own error is on the query node). Connect your cluster shows the three ways in.");
    return;
  }
  if (S.focus && !(services.includes(S.focus) || workloads.includes(S.focus))) S.focus = null; // gone from the data
  if (S.focus) drill(S.focus); else { noteList(); overview(); }
  wrap.append("div").style("opacity", 0.65).style("max-width", W - 20 + "px").style("margin-top", "10px").html(
    "Usual band: the median of the 30 min before each point ± 3 × 1.4826 × MAD (points already outside left out), at least ±5%. Forecast: Holt's linear smoothing since the last drop; the range is rough (90%, from its one-step error). " +
    "Points are 1-minute rates every 15 s, so neighbours are not independent. " + (S.focus ? "Next: expand to the other services or the nodes, or go back to the namespace." : "Next: click a service, workload or note to drill down into its pods, events and logs."));
}
render();
return wrap.node();