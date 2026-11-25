// The protein residue by residue (left to right, N- to C-terminus), with
// four tracks:
// - AlphaFold's confidence (pLDDT): low means no fixed fold;
// - AlphaMissense: one row per amino acid it could become, red = predicted
//   pathogenic;
// - gnomAD: the changes people carry, higher = more common;
// - ClinVar: what clinics concluded.
// Notice how the red rows line up with the high-confidence fold, and how
// the common changes sit in the blue. Hover a cell; click a residue to
// show it in 3D (it sets the residue parameter). Drag on the axis to zoom.
const s = data || {};
const res = s.residues || [];
const W = Math.max(640, fit?.width ?? 1100), H = Math.max(460, fit?.height ?? 600);
const AA = "ACDEFGHIKLMNPQRSTVWY".split("");
const m = {l: 118, r: 16, t: 50};
const T = {plddt: 44, gap: 10, am: Math.max(200, H - 50 - 44 - 10 - 70 - 60 - 40), gn: 60, cv: 40};
const y0 = {plddt: m.t, am: m.t + T.plddt + T.gap};
y0.gn = y0.am + T.am + T.gap; y0.cv = y0.gn + T.gn + T.gap; const axisY = y0.cv + T.cv + 6;
const svg = d3.create("svg").attr("width", W).attr("height", axisY + 40).style("font", "11px system-ui, sans-serif").style("color", "#e4e4e7");
const x = d3.scaleLinear([0.5, res.length + 0.5], [m.l, W - m.r]);
let xz = x;
const am = d3.scaleSequential([0, 1], (t) => d3.interpolateRdYlBu(1 - t));
const conf = (p) => p >= 90 ? "#0053d6" : p >= 70 ? "#65cbf3" : p >= 50 ? "#ffdb13" : "#ff7d45"; // AlphaFold's colours
const fmtAF = (af) => af === 0 ? "never seen" : af < 1e-5 ? af.toExponential(1) : (af * 100).toPrecision(2) + "%";
const variants = new Map((s.variants || []).map((v) => [v.change, v]));
const selected = +(parameters?.residue || 0);

svg.append("text").attr("x", m.l).attr("y", 18).attr("fill", "currentColor").style("font-size", "14px").style("font-weight", 600)
  .text(`${s.gene || ""} · ${s.protein || ""}: every single amino-acid change, predicted, carried and diagnosed`);
svg.append("text").attr("x", m.l).attr("y", 35).attr("fill", "#a1a1aa")
  .text(`${res.length} residues · ${s.possible?.toLocaleString()} possible changes, ${s.reachable?.toLocaleString()} reachable by one DNA letter · AlphaFold ${s.alphafold?.entry || ""} (mean pLDDT ${s.alphafold?.mean_plddt ?? "?"})`);
const label = (y, h, t, sub, dx = 8) => {
  svg.append("text").attr("x", m.l - dx).attr("y", y + h / 2 - (sub ? 4 : -4)).attr("text-anchor", "end").attr("fill", "currentColor").style("font-weight", 600).text(t);
  if (sub) svg.append("text").attr("x", m.l - dx).attr("y", y + h / 2 + 10).attr("text-anchor", "end").attr("fill", "#a1a1aa").text(sub);
};
label(y0.plddt, T.plddt, "AlphaFold", "confidence");
label(y0.am, T.am, "AlphaMissense", "becomes ↓");
label(y0.gn, T.gn, "gnomAD", "carried", 40);
label(y0.cv, T.cv, "ClinVar", "diagnosed", 58);

const clip = svg.append("defs").append("clipPath").attr("id", "pm-clip").append("rect").attr("x", m.l).attr("y", 0).attr("width", W - m.l - m.r).attr("height", axisY);
const g = svg.append("g").attr("clip-path", "url(#pm-clip)");
const yA = d3.scaleBand(AA, [y0.am, y0.am + T.am]);
AA.forEach((a) => svg.append("text").attr("x", m.l - 2).attr("y", yA(a) + yA.bandwidth() / 2 + 3).attr("text-anchor", "end").attr("fill", "#71717a").style("font-size", "9px").text(a));

// cells are drawn on a canvas inside the SVG: 20 × length rects would be slow
const canvasW = res.length, img = document.createElement("canvas");
img.width = canvasW; img.height = AA.length;
const ctx = img.getContext("2d");
res.forEach((r, i) => AA.forEach((a, j) => {
  const v = r.subs[a];
  ctx.fillStyle = a === r.aa ? "#27272a" : v == null ? "#18181b" : am(v);
  ctx.fillRect(i, j, 1, 1);
}));
const amImage = g.append("image").attr("href", img.toDataURL()).attr("preserveAspectRatio", "none").style("image-rendering", "pixelated")
  .attr("y", y0.am).attr("height", T.am);
const plddtBars = g.append("g").selectAll("rect").data(res).join("rect")
  .attr("y", (r) => y0.plddt + T.plddt * (1 - (r.plddt ?? 0) / 100)).attr("height", (r) => T.plddt * (r.plddt ?? 0) / 100).attr("fill", (r) => conf(r.plddt));
const yG = d3.scaleLog([1e-6, 0.5], [y0.gn + T.gn, y0.gn]).clamp(true);
const seen = (s.variants || []).filter((v) => v.ac);
const gnDots = g.append("g").selectAll("circle").data(seen).join("circle").attr("r", 2.6)
  .attr("cy", (v) => yG(Math.max(v.af, 1e-6))).attr("fill", (v) => am(v.am)).attr("stroke", "#09090b").attr("stroke-width", 0.5);
const cvCol = {pathogenic: "#ef4444", benign: "#3b82f6", uncertain: "#a1a1aa", conflicting: "#f59e0b"};
const cvRow = {pathogenic: 0, conflicting: 1, uncertain: 2, benign: 3};
const cv = (s.variants || []).filter((v) => v.clinvar in cvRow);
const cvTicks = g.append("g").selectAll("rect").data(cv).join("rect")
  .attr("y", (v) => y0.cv + cvRow[v.clinvar] * T.cv / 4).attr("height", T.cv / 4 - 1).attr("fill", (v) => cvCol[v.clinvar]).attr("opacity", 0.85);
const sel = g.append("rect").attr("y", y0.plddt - 4).attr("height", axisY - y0.plddt).attr("fill", "none").attr("stroke", "#fafafa").attr("stroke-width", 1).attr("display", selected ? null : "none");
const axis = svg.append("g").attr("transform", `translate(0,${axisY})`);
svg.append("text").attr("x", W - m.r).attr("y", axisY + 30).attr("text-anchor", "end").attr("fill", "#a1a1aa").text("residue →  (drag here to zoom, double-click to reset)");
const gnAxis = svg.append("g").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(yG).tickValues([1e-5, 1e-3, 1e-1]).tickFormat((t) => t >= 0.01 ? t * 100 + "%" : t.toExponential(0)).tickSize(3));
gnAxis.selectAll("text").attr("fill", "#71717a").style("font-size", "9px"); gnAxis.select(".domain").remove();
["P/LP", "conflicting", "VUS", "B/LB"].forEach((t, i) => svg.append("text").attr("x", m.l - 2).attr("y", y0.cv + i * T.cv / 4 + 8).attr("text-anchor", "end").attr("fill", Object.values(cvCol)[[0, 3, 2, 1][i]]).style("font-size", "8px").text(t));

function draw() {
  const k = (xz(2) - xz(1));
  amImage.attr("x", xz(0.5)).attr("width", xz(res.length + 0.5) - xz(0.5));
  plddtBars.attr("x", (r) => xz(r.pos - 0.5)).attr("width", Math.max(0.5, k));
  gnDots.attr("cx", (v) => xz(v.pos));
  cvTicks.attr("x", (v) => xz(v.pos - 0.5)).attr("width", Math.max(1, k));
  sel.attr("x", xz(selected - 0.5)).attr("width", Math.max(2, k));
  axis.call(d3.axisBottom(xz).ticks(Math.min(20, W / 70)).tickFormat(d3.format("d"))).selectAll("text").attr("fill", "#a1a1aa");
  axis.selectAll("line,path").attr("stroke", "#52525b");
}
draw();
// zoom: brush on the axis band
const brush = d3.brushX().extent([[m.l, axisY], [W - m.r, axisY + 24]]).on("end", ({selection}) => {
  if (!selection) return;
  const [a, b] = selection.map(xz.invert);
  if (b - a >= 3) { xz = x.copy().domain([a, b]); draw(); }
  svg.select(".pm-brush").call(brush.move, null);
});
svg.append("g").attr("class", "pm-brush").call(brush).on("dblclick", () => { xz = x; draw(); });

// hover and click: one overlay over the tracks
const tip = d3.create("div").style("position", "absolute").style("pointer-events", "none").style("background", "#18181bee")
  .style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "6px 8px").style("font", "12px system-ui")
  .style("color", "#e4e4e7").style("max-width", "300px").style("display", "none");
const at = (ev) => { const [px, py] = d3.pointer(ev); const pos = Math.round(xz.invert(px)); return {px, py, r: res[pos - 1]}; };
svg.append("rect").attr("x", m.l).attr("y", y0.plddt).attr("width", W - m.l - m.r).attr("height", axisY - y0.plddt)
  .attr("fill", "transparent").style("cursor", "pointer")
  .on("mousemove", (ev) => {
    const {px, py, r} = at(ev);
    if (!r) return tip.style("display", "none");
    let html = `<b>${r.aa}${r.pos}</b> · pLDDT ${r.plddt?.toFixed(0) ?? "?"} · mean AlphaMissense ${r.am_mean?.toFixed(2) ?? "?"}`;
    if (py >= y0.am && py < y0.am + T.am) {
      const a = AA[Math.min(19, Math.floor((py - y0.am) / yA.step()))];
      const v = variants.get(`${r.aa}${r.pos}${a}`);
      html += a === r.aa ? `<br>(the residue itself)` : `<br><b>${r.aa}${r.pos}${a}</b>: AlphaMissense ${r.subs[a]?.toFixed(3) ?? "?"} (${r.subs[a] >= 0.564 ? "likely pathogenic" : r.subs[a] <= 0.34 ? "likely benign" : "ambiguous"})` +
        (v ? `<br>gnomAD: ${v.ac ? `${v.ac} of ${v.an.toLocaleString()} alleles (${fmtAF(v.af)})` : "not seen"}<br>ClinVar: ${v.clinvar_text || "—"}${v.stars ? ` (${"★".repeat(v.stars)})` : ""}`
           : `<br><span style="color:#a1a1aa">needs two or three DNA letters changed: not in gnomAD or ClinVar</span>`);
    } else {
      const here = (s.variants || []).filter((v) => v.pos === r.pos && (v.ac || v.clinvar));
      html += `<br>${r.gnomad} changes carried in gnomAD${r.max_af ? `, the commonest ${fmtAF(r.max_af)}` : ""}<br>ClinVar: ${r.clinvar_path} pathogenic, ${r.clinvar_vus} uncertain, ${r.clinvar_benign} benign` +
        (here.length ? `<br><span style="color:#a1a1aa">${here.slice(0, 8).map((v) => `${v.change} ${v.am.toFixed(2)}`).join(" · ")}</span>` : "");
    }
    html += `<br><span style="color:#71717a">click: show ${r.aa}${r.pos} in 3D</span>`;
    tip.html(html).style("display", null).style("left", Math.min(W - 310, px + 14) + "px").style("top", (py + 14) + "px");
  })
  .on("mouseleave", () => tip.style("display", "none"))
  .on("click", (ev) => { const {r} = at(ev); if (r) setParameter("residue", String(r.pos)); });

// the colour key
const key = svg.append("g").attr("transform", `translate(${m.l},${axisY + 20})`);
const grad = svg.select("defs").append("linearGradient").attr("id", "pm-am");
d3.range(0, 1.01, 0.1).forEach((t) => grad.append("stop").attr("offset", t).attr("stop-color", am(t)));
key.append("rect").attr("width", 140).attr("height", 8).attr("fill", "url(#pm-am)");
key.append("text").attr("x", 0).attr("y", 20).attr("fill", "#a1a1aa").text("0 benign");
key.append("text").attr("x", 140).attr("y", 20).attr("text-anchor", "end").attr("fill", "#a1a1aa").text("pathogenic 1");
key.append("text").attr("x", 150).attr("y", 8).attr("fill", "#a1a1aa").text("AlphaMissense · pLDDT: ");
[["≥ 90", "#0053d6"], ["70–90", "#65cbf3"], ["50–70", "#ffdb13"], ["< 50", "#ff7d45"]].forEach(([t, c], i) => {
  key.append("rect").attr("x", 285 + i * 52).attr("y", 0).attr("width", 9).attr("height", 9).attr("fill", c);
  key.append("text").attr("x", 297 + i * 52).attr("y", 8).attr("fill", "#a1a1aa").text(t);
});
const box = document.createElement("div");
box.style.position = "relative";
box.append(svg.node(), tip.node());
return box;