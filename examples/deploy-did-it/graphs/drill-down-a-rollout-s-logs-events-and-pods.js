// Drill down into one rollout: which log messages (Loki) came or went
// between its before and after windows, as lines per hour, and its
// Kubernetes events and pods. Choose the rollout above; hover a message for
// a full example line.
// Inputs: 0 the verdicts, 1 the log messages per rollout, 2 the events and pods.
const vs = (Array.isArray(data?.[0]) ? data[0] : []).filter(v => v.before_from_ms != null).sort((a, b) => b.rollout - a.rollout);
const logs = Array.isArray(data?.[1]) ? data[1] : [];
const objs = Array.isArray(data?.[2]) ? data[2] : [];
const W = Math.max(560, fit?.width || 980);
const sample = vs.some(v => v.sample);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);
const wrap = d3.create("div").style("position", "relative").style("font", "12px system-ui, sans-serif").style("color", "currentColor").style("width", W + "px");
const head = wrap.append("div").style("display", "flex").style("gap", "8px").style("align-items", "center").style("flex-wrap", "wrap");
if (sample) head.append("span").style("background", "#f59e0b").style("color", "#000").style("font-weight", 700).style("padding", "2px 8px").style("border-radius", "4px").text("SAMPLE DATA: connect your cluster to run on yours");
if (!vs.length) { wrap.append("p").text("No rollout has windows yet (see the verdicts)."); return wrap.node(); }
head.append("span").text("Rollout:");
const pickDefault = (vs.find(v => v.status === "tested" && v.verdict === "worse") || vs.find(v => v.status === "tested") || vs[0]).rollout;
const sel = head.append("select").style("font", "inherit").style("background", "transparent").style("color", "inherit").style("border", "1px solid #52525b").style("border-radius", "4px");
sel.selectAll("option").data(vs).join("option").attr("value", v => v.rollout).property("selected", v => v.rollout === pickDefault).text(v => `${v.label}: ${v.verdict}`);
const tip = wrap.append("div").style("position", "absolute").style("pointer-events", "none").style("opacity", 0).style("max-width", "460px")
  .style("background", "#09090b").style("color", "#f4f4f5").style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "6px 8px").style("z-index", 5);
const show = (e, html) => { const r = wrap.node().getBoundingClientRect(); tip.html(html).style("opacity", 1).style("left", Math.min(e.clientX - r.left + 14, W - 470) + "px").style("top", (e.clientY - r.top + 14) + "px"); };
const hide = () => tip.style("opacity", 0);
const body = wrap.append("div");
const fmtT = d3.utcFormat("%d %b %H:%M UTC");
function render(rev) {
  body.selectAll("*").remove();
  const v = vs.find(x => x.rollout === rev);
  body.append("p").style("margin", "6px 0").html(`<b>${esc(v.label)}</b>, ${v.at ? fmtT(new Date(v.at_ms)) : "time unknown"}. Before: ${fmtT(new Date(v.before_from_ms))} – ${fmtT(new Date(v.before_to_ms))}; after: ${fmtT(new Date(v.after_from_ms))} – ${fmtT(new Date(v.after_to_ms))}. ` +
    (v.status === "tested" ? esc(v.p99_sentence) + ". " + esc(v.err_sentence) + "." : "Not tested: " + esc(v.reason) + "."));
  // log messages: before vs after, per hour
  const ls = logs.filter(l => l.rollout === rev);
  body.append("div").style("font-weight", 600).style("margin-top", "6px").text("Log messages (Loki, logql in Parameters), lines per hour: before ▸ after");
  if (!ls.length) body.append("p").style("opacity", 0.75).text("No matching log lines in these windows: Loki may not keep logs this old, the 5000-line limit may have cut them, or logql doesn't match this service's lines.");
  else {
    const rowH = 22, sw = W, sh = ls.length * rowH + 24, L = Math.min(560, W * 0.55);
    const svg = body.append("svg").attr("width", sw).attr("height", sh);
    const xx = d3.scaleLinear().domain([0, d3.max(ls, l => Math.max(l.before_per_hour, l.after_per_hour)) || 1]).nice().range([L + 10, sw - 60]);
    svg.append("g").attr("transform", `translate(0,${sh - 18})`).call(d3.axisBottom(xx).ticks(5)).call(g => g.selectAll("text").attr("fill", "currentColor")).call(g => g.selectAll("line,path").attr("stroke", "currentColor").attr("stroke-opacity", 0.3));
    const g = svg.append("g").selectAll("g").data(ls).join("g").attr("transform", (l, i) => `translate(0,${i * rowH + 4})`)
      .on("mousemove", (e, l) => show(e, `<b>${esc(l.level)}</b> ${esc(l.example)}<br><br>before: ${l.before} lines (${l.before_per_hour.toFixed(1)}/h) · after: ${l.after} lines (${l.after_per_hour.toFixed(1)}/h), from ${l.pods} pod${l.pods === 1 ? "" : "s"}` +
        (l.new ? "<br><span style='color:#f87171'>new after the rollout</span>" : l.gone ? "<br><span style='color:#4ade80'>gone after the rollout</span>" : "")))
      .on("mouseleave", hide);
    g.append("text").attr("x", 0).attr("y", 13).attr("fill", l => l.new ? "#f87171" : l.gone ? "#4ade80" : "currentColor")
      .text(l => (l.new ? "NEW " : l.gone ? "GONE " : "") + (l.template.length > L / 6.2 ? l.template.slice(0, Math.floor(L / 6.2) - 1) + "…" : l.template));
    g.append("line").attr("x1", l => xx(l.before_per_hour)).attr("x2", l => xx(l.after_per_hour)).attr("y1", 9).attr("y2", 9).attr("stroke", "#71717a").attr("stroke-width", 2);
    g.append("circle").attr("cx", l => xx(l.before_per_hour)).attr("cy", 9).attr("r", 4).attr("fill", "#60a5fa");
    g.append("circle").attr("cx", l => xx(l.after_per_hour)).attr("cy", 9).attr("r", 4).attr("fill", "#f97316");
    g.append("text").attr("x", sw - 54).attr("y", 13).attr("fill", "currentColor").attr("opacity", 0.7).text(l => `${l.before} ▸ ${l.after}`);
  }
  // events and pods
  const os = objs.filter(o => o.rollout === rev);
  const ev = os.filter(o => o.what !== "pod"), pods = os.filter(o => o.what === "pod");
  body.append("div").style("font-weight", 600).style("margin-top", "10px").text(`Kubernetes events in the windows (${ev.filter(o => o.what === "event").length}, warnings first)`);
  const tbl = body.append("div").style("max-height", "220px").style("overflow", "auto").append("table").style("border-collapse", "collapse").style("width", "100%");
  ev.forEach(o => {
    const tr = tbl.append("tr").style("border-top", "1px solid #27272a");
    tr.append("td").style("padding", "2px 6px").style("white-space", "nowrap").style("opacity", 0.75).text(o.what === "event" ? `${o.minutes >= 0 ? "+" : ""}${o.minutes}′` : "");
    tr.append("td").style("padding", "2px 6px").style("color", o.type === "Warning" ? "#fbbf24" : "inherit").text(o.reason + (o.count > 1 ? ` ×${o.count}` : ""));
    tr.append("td").style("padding", "2px 6px").style("opacity", 0.8).text(o.object);
    tr.append("td").style("padding", "2px 6px").text(o.message);
  });
  body.append("div").style("font-weight", 600).style("margin-top", "10px").text("Pods of this revision still running");
  body.append("p").style("margin", "2px 0").text(pods.length ? pods.map(p => `${p.object.replace("Pod/", "")} (${p.type}, ${p.message})`).join(" · ") : "None: later rollouts replaced them. Their logs stay in Loki, their metrics in Prometheus.");
  body.append("p").style("opacity", 0.7).style("margin-top", "8px").text("Events expire (an hour by default, --event-ttl), so older rollouts show only what Loki and Prometheus kept. Next: expand to the other services at the same time (the Expand heatmap), or open the lines themselves with the logcli command on the verdict card.");
}
sel.on("change", function () { render(Number(this.value)); });
render(pickDefault);
return wrap.node();