// Expand: each rollout (rows) against every service of the namespace
// (columns, the released one first): the change of median p99 from its
// before to its after window. Only the released service changed version;
// a column of the same colour across services points to a shared cause.
// Inputs: 0 the neighbours, 1 the verdicts.
const ns = Array.isArray(data?.[0]) ? data[0] : [];
const vs = Array.isArray(data?.[1]) ? data[1] : [];
const W = Math.max(420, fit?.width || 760);
const sample = ns.some(n => n.sample);
const services = [...new Set(ns.filter(n => n.released).map(n => n.service)), ...[...new Set(ns.filter(n => !n.released).map(n => n.service))].sort()];
const rolls = [...new Set(ns.map(n => n.rollout))].sort((a, b) => b - a);
const wrap = d3.create("div").style("position", "relative").style("font", "12px system-ui, sans-serif").style("color", "currentColor");
if (sample) wrap.append("div").style("background", "#f59e0b").style("color", "#000").style("font-weight", 700).style("padding", "2px 8px").style("border-radius", "4px").style("width", "fit-content").style("margin-bottom", "6px").text("SAMPLE DATA: connect your cluster to run on yours");
if (!ns.length) { wrap.append("p").text("No services' p99 in the rollouts' windows: check neighbours_p99_promql in Parameters (it groups by service)."); return wrap.node(); }
const label = new Map(vs.map(v => [v.rollout, v]));
const L = 290, cw = Math.max(60, Math.min(120, (W - L - 20) / services.length)), rh = 26;
const svg = wrap.append("svg").attr("width", L + cw * services.length + 10).attr("height", 30 + rolls.length * rh);
const c = d3.scaleDiverging([-30, 0, 30], t => d3.interpolateRdBu(1 - t)).clamp(true);
svg.selectAll("text.s").data(services).join("text").attr("x", (s, i) => L + i * cw + cw / 2).attr("y", 18).attr("text-anchor", "middle").attr("fill", "currentColor").style("font-weight", (s, i) => i === 0 ? 700 : 400).text((s, i) => i === 0 ? s + " (released)" : s);
const tip = wrap.append("div").style("position", "absolute").style("pointer-events", "none").style("opacity", 0).style("background", "#09090b").style("color", "#f4f4f5").style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "6px 8px");
const show = (e, html) => { const r = wrap.node().getBoundingClientRect(); tip.html(html).style("opacity", 1).style("left", (e.clientX - r.left + 14) + "px").style("top", (e.clientY - r.top + 14) + "px"); };
rolls.forEach((rev, j) => {
  const v = label.get(rev) || {};
  svg.append("text").attr("x", 0).attr("y", 30 + j * rh + 16).attr("fill", "currentColor").text((v.label || "Rollout " + rev).slice(0, 46));
  services.forEach((s, i) => {
    const d = ns.find(n => n.rollout === rev && n.service === s);
    const ok = d && d.change_pct != null && d.n_before >= 4 && d.n_after >= 4;
    svg.append("rect").attr("x", L + i * cw + 1).attr("y", 30 + j * rh + 1).attr("width", cw - 2).attr("height", rh - 2).attr("rx", 3)
      .attr("fill", ok ? c(d.change_pct) : "transparent").attr("stroke", "#3f3f46")
      .on("mousemove", e => show(e, ok ? `<b>${s}</b> around ${v.label || rev}<br>median p99 ${Math.round(d.before_ms)} → ${Math.round(d.after_ms)} ms (${d3.format("+.0f")(d.change_pct)}%)<br>${d.n_before} points before, ${d.n_after} after` + (i ? "" : `<br>${v.p99_sentence || v.reason || ""}`) : `<b>${s}</b>: too few points in the windows`))
      .on("mouseleave", () => tip.style("opacity", 0));
    svg.append("text").attr("x", L + i * cw + cw / 2).attr("y", 30 + j * rh + 17).attr("text-anchor", "middle").style("pointer-events", "none")
      .attr("fill", ok ? (Math.abs(d.change_pct) > 18 ? "#fff" : "#18181b") : "currentColor").text(ok ? d3.format("+.0f")(d.change_pct) + "%" : "–");
  });
});
wrap.append("p").style("opacity", 0.75).style("max-width", (L + cw * services.length) + "px").text(
  "Red: p99 rose after the rollout, blue: it fell (median of the after window against the before window). A change in the released column alone points at the release; the same colour across the row points at something shared: traffic, a dependency, the nodes. " +
  "Next: expand further with the namespace's other signals (CPU throttling, the database), or the same rollouts in another namespace or cluster.");
return wrap.node();