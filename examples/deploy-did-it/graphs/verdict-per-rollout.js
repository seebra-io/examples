// A verdict card per rollout, newest first: what changed in plain words,
// the interval and the test, the points compared (hover them), the caveats,
// and the next step: drill down (its logs, events and pods) or expand (the
// other services, the rollout before it).
// Inputs: 0 the verdicts, 1 the windows.
const vs = (Array.isArray(data?.[0]) ? data[0] : []).slice().sort((a, b) => b.rollout - a.rollout);
const ws = Array.isArray(data?.[1]) ? data[1] : [];
const W = Math.max(360, fit?.width || 980);
const cols = W > 900 ? 2 : 1;
const sample = vs.some(v => v.sample);
const colour = {worse: "#ef4444", better: "#22c55e", "no clear change": "#a1a1aa", "not tested": "#71717a"};
const fmtT = d3.utcFormat("%a %d %b %H:%M UTC"), iso = d3.utcFormat("%Y-%m-%dT%H:%M:%SZ");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);
const wrap = d3.create("div").style("position", "relative").style("font", "12px system-ui, sans-serif").style("color", "currentColor").style("width", W + "px");
if (sample) wrap.append("div").style("background", "#f59e0b").style("color", "#000").style("font-weight", 700).style("padding", "3px 8px").style("border-radius", "4px").style("margin-bottom", "8px").style("display", "inline-block")
  .attr("title", "A made-up cluster (namespace shop, deployment api), generated from a model. Set the datasources' URLs and Parameters to run on yours.")
  .text("SAMPLE DATA: connect your cluster to run on yours");
if (!vs.length) { wrap.append("p").text("No rollouts found: is the deployment name right (Parameters: deployment), and does the Kubernetes datasource answer for the namespace?"); return wrap.node(); }
const tip = wrap.append("div").style("position", "absolute").style("pointer-events", "none").style("opacity", 0).style("max-width", "340px")
  .style("background", "#09090b").style("color", "#f4f4f5").style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "6px 8px").style("z-index", 5);
const show = (e, html) => { const r = wrap.node().getBoundingClientRect(); tip.html(html).style("opacity", 1).style("left", Math.min(e.clientX - r.left + 14, W - 350) + "px").style("top", (e.clientY - r.top + 14) + "px"); };
const hide = () => tip.style("opacity", 0);
const grid = wrap.append("div").style("display", "grid").style("grid-template-columns", `repeat(${cols}, minmax(0, 1fr))`).style("gap", "10px");
const copyBtn = (el, text) => el.append("button").text("copy").style("font", "inherit").style("font-size", "10px").style("margin-left", "6px").style("padding", "0 5px")
  .style("border", "1px solid #52525b").style("border-radius", "3px").style("background", "transparent").style("color", "inherit").style("cursor", "pointer")
  .on("click", function () { try { navigator.clipboard.writeText(text); d3.select(this).text("copied"); } catch (_) { d3.select(this).text("select it"); } });
vs.forEach((v, idx) => {
  const c = grid.append("div").style("border", "1px solid #3f3f46").style("border-left", `4px solid ${colour[v.verdict] || "#71717a"}`).style("border-radius", "6px").style("padding", "8px 10px");
  const h = c.append("div").style("display", "flex").style("gap", "8px").style("align-items", "baseline").style("flex-wrap", "wrap");
  h.append("span").style("font-weight", 700).style("font-size", "13px").text(v.label);
  h.append("span").style("background", colour[v.verdict] || "#71717a").style("color", "#000").style("border-radius", "3px").style("padding", "0 6px").style("font-weight", 600).text(v.verdict);
  h.append("span").style("opacity", 0.7).text(v.at ? fmtT(new Date(v.at_ms)) : "time unknown");
  if (v.status !== "tested") {
    c.append("p").style("margin", "6px 0").html(`<b>Not tested:</b> ${esc(v.reason)}.`);
  } else {
    c.append("p").style("margin", "6px 0 2px").style("font-size", "13px").style("font-weight", 600).text(v.p99_sentence);
    c.append("div").text(v.err_sentence);
    c.append("div").text(v.restarts_sentence);
    if (v.traffic_ratio != null) c.append("div").style("opacity", 0.8).text(`Traffic: ${Math.round(v.traffic_before_rps)} → ${Math.round(v.traffic_after_rps)} req/s (${d3.format("+.0%")(v.traffic_ratio - 1)})`);
    c.append("div").style("opacity", 0.7).style("margin-top", "2px").attr("title", "Rank-biserial r: +1 every point after is above every point before, −1 the other way, 0 no tendency. The interval is a moving-block bootstrap of the difference of medians (blocks of 3 steps, 2000 resamples); the p-value is Mann-Whitney's, two-sided, and Holm's adjusts it for testing every rollout.")
      .text(`n = ${v.n_before} before, ${v.n_after} after · effect size r = ${d3.format("+.2f")(v.p99_r)} · Holm-adjusted p over ${v.tests} rollouts: ${v.p99_p_holm < 0.001 ? "< 0.001" : d3.format(".2g")(v.p99_p_holm)}`);
  }
  // the points compared: p99 before (blue) and after (orange), medians as lines
  const pts = ws.filter(w => w.rollout === v.rollout && w.p99_ms != null);
  if (pts.length) {
    const sw = Math.min(W / cols - 40, 420), sh = 64;
    const s = c.append("svg").attr("width", sw).attr("height", sh).style("margin-top", "4px").style("overflow", "visible");
    const xx = d3.scaleLinear().domain(d3.extent(pts, d => d.minutes)).nice().range([28, sw - 6]);
    const yy = d3.scaleLinear().domain(d3.extent(pts, d => d.p99_ms)).nice().range([sh - 14, 4]);
    s.append("g").attr("transform", `translate(0,${sh - 14})`).call(d3.axisBottom(xx).ticks(6).tickFormat(d => d + "′")).call(g => g.selectAll("text").attr("fill", "currentColor").style("font-size", "9px")).call(g => g.selectAll("line,path").attr("stroke", "currentColor").attr("stroke-opacity", 0.3));
    s.append("g").attr("transform", "translate(28,0)").call(d3.axisLeft(yy).ticks(3)).call(g => g.selectAll("text").attr("fill", "currentColor").style("font-size", "9px")).call(g => g.selectAll("line,path").attr("stroke", "currentColor").attr("stroke-opacity", 0.3));
    s.append("line").attr("x1", xx(0)).attr("x2", xx(0)).attr("y1", 0).attr("y2", sh - 14).attr("stroke", colour[v.verdict]).attr("stroke-dasharray", "2 2");
    for (const [w, m, col] of [["before", v.p99_before_ms, "#60a5fa"], ["after", v.p99_after_ms, "#f97316"]]) {
      const pw = pts.filter(p => p.window === w);
      if (m != null && pw.length) s.append("line").attr("x1", xx(d3.min(pw, p => p.minutes))).attr("x2", xx(d3.max(pw, p => p.minutes))).attr("y1", yy(m)).attr("y2", yy(m)).attr("stroke", col).attr("stroke-width", 2);
      s.append("g").selectAll("circle").data(pw).join("circle").attr("cx", p => xx(p.minutes)).attr("cy", p => yy(p.p99_ms)).attr("r", 2.6).attr("fill", col)
        .on("mousemove", (e, p) => show(e, `<b>${w}</b>, ${p.minutes} min from the rollout<br>${fmtT(new Date(p.t_ms))}<br>p99 ${Math.round(p.p99_ms)} ms · errors ${p.error_pct != null ? p.error_pct.toFixed(2) + "%" : "?"} · ${p.traffic_rps != null ? Math.round(p.traffic_rps) + " req/s" : ""}`))
        .on("mouseleave", hide);
    }
    s.append("text").attr("x", sw - 6).attr("y", 10).attr("text-anchor", "end").attr("fill", "currentColor").attr("opacity", 0.6).style("font-size", "9px").text("p99 ms: before · after, minutes from the rollout");
  }
  if (v.caveats) {
    const cv = c.append("div").style("display", "flex").style("flex-wrap", "wrap").style("gap", "4px").style("margin-top", "4px");
    v.caveats.split(" · ").forEach(t => cv.append("span").style("border", "1px solid #92400e").style("color", "#fbbf24").style("border-radius", "10px").style("padding", "0 7px").style("cursor", "help").attr("title", t).text("⚠ " + (t.length > 64 ? t.slice(0, 62) + "…" : t)));
  }
  // the next step
  const ns = v.namespace, dep = v.deployment, from = v.before_from_ms ? iso(new Date(v.before_from_ms)) : null, to = v.after_to_ms ? iso(new Date(v.after_to_ms)) : null;
  const det = c.append("details").style("margin-top", "6px");
  det.append("summary").style("cursor", "pointer").style("opacity", 0.85).text("Next: drill down ↓ · expand ↔");
  const dd = det.append("div").style("margin", "4px 0 0 4px");
  dd.append("div").html("<b>Drill down</b> into this rollout: its log messages before vs after, its events and pods: the <i>Drill down</i> graph (choose rollout " + v.rollout + ").");
  const cmds = [
    [`kubectl -n ${ns} rollout history deployment/${dep} --revision=${v.rollout}`, "what the revision's pod template is"],
    [`kubectl -n ${ns} get events --field-selector involvedObject.name=${v.replicaset} --sort-by=.lastTimestamp`, "its ReplicaSet's events (they expire)"],
  ];
  if (from && to) cmds.push([`logcli query --from=${from} --to=${to} --limit=1000 '{namespace="${ns}", app="${dep}"}'`, "every log line of the two windows (Loki's logcli)"]);
  cmds.forEach(([cmd, what]) => { const r = dd.append("div").style("margin-top", "2px"); r.append("code").style("font-size", "10.5px").style("word-break", "break-all").text(cmd); copyBtn(r, cmd); r.append("span").style("opacity", 0.6).text(" " + what); });
  const ex = det.append("div").style("margin", "6px 0 0 4px");
  ex.append("div").html("<b>Expand</b> to what else happened: " + (v.neighbours_checked ? (v.neighbours_moved ? `the other services moved too (${esc(v.neighbours_moved)}): see <i>Expand: did the other services move too?</i>` : `none of the ${v.neighbours_checked} other services moved (the <i>Expand</i> heatmap)`) : "no other services' p99 came back (neighbours_p99_promql)") + ".");
  const prev = vs[idx + 1];
  if (prev) ex.append("div").style("margin-top", "2px").text(`The rollout before: ${prev.label}: ${prev.status === "tested" ? prev.verdict : "not tested"}.`);
  ex.append("div").style("margin-top", "2px").style("opacity", 0.75).text("Ask further in the study card: a regression of p99 on traffic with the version as a predictor separates a load effect from the release; a canary (both versions at once) is the stronger design.");
});
wrap.append("p").style("opacity", 0.7).style("margin-top", "8px").style("max-width", W + "px").text(
  "How to read it: the medians of the hour before and the hour after (from 5 minutes in), the difference with a 95% interval (moving-block bootstrap), and the Mann-Whitney U test. " +
  "\"Raised\" needs p < 0.05 and an interval above zero. Neighbouring 5-minute points are not independent, so treat the p-value as a screen; the caveats name what else could explain a change. " +
  "Windows and the settle time are in Parameters (before_minutes, after_minutes, settle_minutes).");
return wrap.node();