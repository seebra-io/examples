// p99 latency, errors and traffic of the deployment over the window, with a
// marker per rollout coloured by its verdict. Hover a marker for its
// verdict and caveats, click it to zoom to its before/after windows (the
// medians compared are drawn); hover the curves for the values at a time.
// Inputs: 0 the series, 1 the verdicts.
const rows = Array.isArray(data?.[0]) ? data[0] : [];
const vs = (Array.isArray(data?.[1]) ? data[1] : []).filter(v => v.at_ms != null);
const W = Math.max(640, fit?.width || 980), M = {l: 56, r: 16, t: 62, b: 26}, PH = [150, 90, 90], GAP = 18;
const H = M.t + PH.reduce((a, b) => a + b) + GAP * 2 + M.b;
const sample = rows.some(r => r.sample) || vs.some(v => v.sample);
const by = d3.group(rows, r => r.signal);
const api = s => (by.get(s) || []).slice().sort((a, b) => a.t_ms - b.t_ms);
const p99 = api("p99"), err = api("error_ratio"), traffic = api("traffic"), restarts = api("restarts").filter(r => r.value > 0);
const nbs = d3.groups(by.get("neighbour_p99") || [], r => r.service).map(([s, v]) => [s, v.slice().sort((a, b) => a.t_ms - b.t_ms)]);
const colour = {worse: "#ef4444", better: "#22c55e", "no clear change": "#a1a1aa", "not tested": "#71717a"};
const fmtT = d3.utcFormat("%a %d %b %H:%M UTC");
const ext = d3.extent(rows, r => r.t_ms);
const wrap = d3.create("div").style("position", "relative").style("font", "12px system-ui, sans-serif").style("color", "currentColor");
const head = wrap.append("div").style("display", "flex").style("gap", "8px").style("align-items", "center").style("flex-wrap", "wrap").style("margin-bottom", "4px");
if (sample) head.append("span").attr("title", "Made up by a model (scripts/deploy-did-it-sample.mjs), in the exact shape of the Kubernetes, Prometheus and Loki APIs. To run on yours: set the three datasources' URLs (kubectl proxy on http://localhost:8001, Prometheus on http://localhost:9090/api/v1, Loki on http://localhost:3100/loki/api/v1, or your organisation's gateway) and your namespace, deployment and metric names in Parameters.")
  .style("background", "#f59e0b").style("color", "#000").style("font-weight", 700).style("padding", "2px 8px").style("border-radius", "4px").style("cursor", "help")
  .text("SAMPLE DATA: connect your cluster to run on yours");
const title = head.append("span").style("font-weight", 600);
const reset = head.append("button").text("← all 7 days").style("display", "none").style("font", "inherit").style("padding", "1px 8px").style("border", "1px solid #71717a").style("border-radius", "4px").style("background", "transparent").style("color", "inherit").style("cursor", "pointer");
if (!rows.length) {
  wrap.append("p").text("No metrics came back. Check the Prometheus datasource and the PromQL in Parameters (p99_promql, error_ratio_promql, traffic_promql, restarts_promql): the board's one query asks for them all at once, and a typo in one leaves all empty. Prometheus' own error is on the query node (signals).");
  return wrap.node();
}
const svg = wrap.append("svg").attr("width", W).attr("height", H).style("overflow", "visible");
const tip = wrap.append("div").style("position", "absolute").style("pointer-events", "none").style("opacity", 0).style("max-width", "380px")
  .style("background", "#09090b").style("color", "#f4f4f5").style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "6px 8px").style("z-index", 5);
const show = (e, html) => { const r = wrap.node().getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top; tip.html(html).style("opacity", 1).style("left", Math.min(x + 14, W - 390) + "px").style("top", (y + 14) + "px"); };
const hide = () => tip.style("opacity", 0);
const x = d3.scaleUtc().domain(ext).range([M.l, W - M.r]);
const tops = [M.t, M.t + PH[0] + GAP, M.t + PH[0] + PH[1] + GAP * 2];
const panels = [
  {name: "p99 latency (ms)", data: p99, y: null, h: PH[0], fmt: d3.format(".0f"), unit: "ms"},
  {name: "errors (% of requests, 5xx)", data: err, y: null, h: PH[1], fmt: d3.format(".2f"), unit: "%"},
  {name: "traffic (req/s) · restarts ▲", data: traffic, y: null, h: PH[2], fmt: d3.format(".0f"), unit: "req/s"},
];
const clipId = "ddi-clip-" + Math.random().toString(36).slice(2);
const defs = svg.append("defs");
tops.forEach((top, i) => defs.append("clipPath").attr("id", clipId + i).append("rect").attr("x", M.l).attr("y", top - 2).attr("width", W - M.l - M.r).attr("height", PH[i] + 4));
const gx = svg.append("g").attr("transform", `translate(0,${H - M.b})`);
const layers = svg.append("g");
function draw() {
  layers.selectAll("*").remove();
  const [d0, d1] = x.domain().map(Number);
  const vis = arr => arr.filter(r => r.t_ms >= d0 && r.t_ms <= d1);
  gx.call(d3.axisBottom(x).ticks(W / 110)).call(g => g.selectAll("text").attr("fill", "currentColor")).call(g => g.selectAll("line,path").attr("stroke", "currentColor").attr("stroke-opacity", 0.4));
  panels.forEach((p, i) => {
    const top = tops[i], g = layers.append("g");
    const extra = i === 0 ? nbs.flatMap(([, v]) => vis(v)) : [];
    const vals = vis(p.data).map(r => r.value).concat(extra.map(r => r.value));
    vals.sort(d3.ascending);
    // p99: its 99.5th percentile (a GC spike shouldn't flatten the rest); errors: on a symlog scale, so 0.25% and a 2.5% incident both read
    p.y = i === 1 ? d3.scaleSymlog().constant(0.2).domain([0, (d3.max(vals) || 1) * 1.1]).nice().range([top + p.h, top])
      : d3.scaleLinear().domain([0, ((i === 0 ? d3.quantile(vals, 0.995) : d3.max(vals)) || 1) * 1.1]).nice().range([top + p.h, top]);
    g.append("g").attr("transform", `translate(${M.l},0)`).call(i === 1 ? d3.axisLeft(p.y).tickValues([0, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25, 50, 100].filter(t => t <= p.y.domain()[1])).tickFormat(d3.format("~g")) : d3.axisLeft(p.y).ticks(p.h / 30))
      .call(a => a.selectAll("text").attr("fill", "currentColor")).call(a => a.selectAll("line,path").attr("stroke", "currentColor").attr("stroke-opacity", 0.4))
      .call(a => a.selectAll(".tick line").clone().attr("x2", W - M.l - M.r).attr("stroke-opacity", 0.08));
    g.append("text").attr("x", M.l + 4).attr("y", top + 10).attr("fill", "currentColor").attr("opacity", 0.8).text(p.name);
    const line = d3.line().x(d => x(d.t_ms)).y(d => p.y(d.value));
    // a gap in the data is a gap in the line
    const split = arr => { const out = [[]]; arr.forEach((d, k) => { if (k && d.t_ms - arr[k - 1].t_ms > 2.5 * 300e3) out.push([]); out[out.length - 1].push(d); }); return out; };
    const cg = g.append("g").attr("clip-path", `url(#${clipId + i})`);
    if (i === 0) nbs.forEach(([s, v]) => split(vis(v)).forEach(seg => cg.append("path").attr("d", line(seg)).attr("fill", "none").attr("stroke", "#a1a1aa").attr("stroke-opacity", 0.35).attr("stroke-width", 1)));
    split(vis(p.data)).forEach(seg => cg.append("path").attr("d", line(seg)).attr("fill", "none").attr("stroke", ["#60a5fa", "#f87171", "#a78bfa"][i]).attr("stroke-width", 1.4));
    if (i === 2) cg.selectAll("path.rs").data(vis(restarts)).join("path").attr("d", d3.symbol(d3.symbolTriangle, 36)).attr("fill", "#ef4444")
      .attr("transform", d => `translate(${x(d.t_ms)},${top + p.h - 5})`)
      .on("mousemove", (e, d) => show(e, `<b>${d.value} container restart${d.value > 1 ? "s" : ""}</b><br>${fmtT(new Date(d.t_ms))}<br>Drill down for the pods' events (BackOff, OOMKilled).`)).on("mouseleave", hide);
  });
  if (focus) {
    const v = focus;
    [["before", v.before_from_ms, v.before_to_ms, "#60a5fa", v.p99_before_ms, v.err_before_pct], ["after", v.after_from_ms, v.after_to_ms, "#f97316", v.p99_after_ms, v.err_after_pct]].forEach(([w, a, b, c, m99, mer]) => {
      if (a == null) return;
      layers.insert("rect", ":first-child").attr("x", x(a)).attr("width", Math.max(1, x(b) - x(a))).attr("y", M.t).attr("height", H - M.t - M.b).attr("fill", c).attr("opacity", 0.1);
      layers.append("text").attr("x", (x(a) + x(b)) / 2).attr("y", M.t - 4).attr("text-anchor", "middle").attr("fill", c).text(w);
      if (m99 != null) layers.append("line").attr("x1", x(a)).attr("x2", x(b)).attr("y1", panels[0].y(m99)).attr("y2", panels[0].y(m99)).attr("stroke", c).attr("stroke-width", 2.5);
      if (mer != null) layers.append("line").attr("x1", x(a)).attr("x2", x(b)).attr("y1", panels[1].y(mer)).attr("y2", panels[1].y(mer)).attr("stroke", c).attr("stroke-width", 2.5);
    });
  }
  // the rollouts
  // badges that would overlap go up a row
  const shown = vs.filter(v => v.at_ms >= d0 && v.at_ms <= d1).sort((a, b) => a.at_ms - b.at_ms);
  const row = new Map(); let lastX = [-1e9, -1e9];
  for (const v of shown) { const px = x(v.at_ms), r = px - lastX[0] < 20 ? (px - lastX[1] < 20 ? 0 : 1) : 0; row.set(v, r); lastX[r] = px; }
  const mk = layers.append("g").selectAll("g").data(shown).join("g").attr("transform", v => `translate(${x(v.at_ms)},0)`).style("cursor", "pointer");
  mk.append("line").attr("y1", v => M.t - 14 - 20 * row.get(v)).attr("y2", H - M.b).attr("stroke", v => colour[v.verdict] || "#a1a1aa").attr("stroke-width", 1.5).attr("stroke-dasharray", v => v.status === "tested" ? null : "3 3");
  mk.append("circle").attr("cy", v => M.t - 22 - 20 * row.get(v)).attr("r", 9).attr("fill", v => colour[v.verdict] || "#a1a1aa");
  mk.append("text").attr("y", v => M.t - 18 - 20 * row.get(v)).attr("text-anchor", "middle").attr("fill", "#000").style("font-weight", 700).style("font-size", "10px").text(v => v.rollout);
  mk.on("mousemove", (e, v) => show(e, `<b>${v.label}</b><br>${fmtT(new Date(v.at_ms))}<br><br>` +
      (v.status === "tested" ? `${v.p99_sentence}<br>${v.err_sentence}<br>${v.restarts_sentence}<br><span style="opacity:.7">effect size r = ${d3.format("+.2f")(v.p99_r)}; Holm-adjusted p over ${v.tests} rollouts: ${d3.format(".2g")(v.p99_p_holm)}</span>` : `<b>Not tested:</b> ${v.reason}`) +
      (v.caveats ? `<br><br><span style="color:#fbbf24">⚠ ${v.caveats.split(" · ").join("<br>⚠ ")}</span>` : "") +
      `<br><br><span style="opacity:.7">${focus === v ? "Click again for all 7 days." : "Click to zoom to its windows."} The verdict card and Drill down have the rest.</span>`))
    .on("mouseleave", hide)
    .on("click", (e, v) => { hide(); zoomTo(focus === v ? null : v); });
}
let focus = null;
function zoomTo(v) {
  focus = v;
  if (v && v.before_from_ms != null) x.domain([v.before_from_ms - 2 * 3600e3, v.after_to_ms + 2 * 3600e3]);
  else if (v) x.domain([v.at_ms - 4 * 3600e3, v.at_ms + 4 * 3600e3]);
  else x.domain(ext);
  reset.style("display", v ? null : "none");
  title.text(v ? `${v.label}, ${fmtT(new Date(v.at_ms))}` : `${vs[0]?.deployment || "the deployment"} in ${vs[0]?.namespace || "?"}: ${vs.length} rollouts, ${vs.filter(v => v.status === "tested").length} tested`);
  draw();
}
reset.on("click", () => zoomTo(null));
// the values at a time
const hair = svg.append("line").attr("y1", M.t).attr("y2", H - M.b).attr("stroke", "currentColor").attr("stroke-opacity", 0.35).style("pointer-events", "none").style("display", "none");
const near = (arr, t) => { const i = d3.bisector(d => d.t_ms).center(arr, t); return arr[i]; };
svg.insert("rect", ":first-child").attr("x", M.l).attr("y", M.t).attr("width", W - M.l - M.r).attr("height", H - M.t - M.b).attr("fill", "transparent")
  .on("mousemove", e => {
    const t = +x.invert(d3.pointer(e)[0]);
    const a = near(p99, t), b = near(err, t), c = near(traffic, t);
    if (!a) return;
    hair.style("display", null).attr("x1", x(a.t_ms)).attr("x2", x(a.t_ms));
    const prev = vs.filter(v => v.at_ms <= a.t_ms).sort((p, q) => q.at_ms - p.at_ms)[0];
    const ago = prev ? Math.round((a.t_ms - prev.at_ms) / 60e3) : null;
    const nb = nbs.map(([s, v]) => { const n = near(v, a.t_ms); return n && Math.abs(n.t_ms - a.t_ms) < 300e3 ? `${s} ${Math.round(n.value)} ms` : null; }).filter(Boolean);
    show(e, `<b>${fmtT(new Date(a.t_ms))}</b><br>p99 ${Math.round(a.value)} ms` + (b ? ` · errors ${b.value.toFixed(2)}%` : "") + (c ? ` · ${Math.round(c.value)} req/s` : "") +
      (nb.length ? `<br><span style="opacity:.7">neighbours: ${nb.join(", ")}</span>` : "") +
      (prev ? `<br>${ago < 120 ? ago + " min" : Math.round(ago / 60) + " h"} after ${prev.label}` : "") +
      (Math.abs(a.t_ms - t) > 600e3 ? `<br><span style="color:#fbbf24">no sample here: a gap in the data</span>` : ""));
  })
  .on("mouseleave", () => { hair.style("display", "none"); hide(); });
zoomTo(null);
wrap.append("div").style("opacity", 0.75).style("max-width", W + "px").style("margin-top", "4px").html(
  "Markers: <span style='color:#ef4444'>●</span> worse, <span style='color:#22c55e'>●</span> better, <span style='color:#a1a1aa'>●</span> no clear change, dashed: not tested (too short, unknown time, outside the window). " +
  "Grey lines in the p99 panel are the other services (neighbours_p99_promql): if they move with it, the cause is likely shared. " +
  "Each point is a 5-minute rate, so short spikes are smoothed and neighbouring points are not independent. Next: click a rollout, then its card's drill down (logs, events, pods) or expand (neighbours, earlier rollouts).");
return wrap.node();