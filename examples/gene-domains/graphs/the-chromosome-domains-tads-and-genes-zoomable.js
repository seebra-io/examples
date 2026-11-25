// The chromosome as a track you can zoom: its domains (TADs) above, nested
// as Arrowhead found them (outer on top), its protein-coding genes below,
// coloured by system (or by the organ their RNA is specific to), and under
// them one row per tissue: the genes whose RNA is specific to it.
// Scroll or pinch to zoom, drag to pan; click a domain or a landmark to zoom
// to it; click a gene to pin its card (links to HPA, Ensembl, GeneCards).
// Type a gene's name to go to it.
// Why a gene sits where it does: every row shares one axis, the position on
// the chromosome. A gene's bar runs from its start to its end; genes that
// overlap stack into lanes. Each outermost domain is a shaded column through
// all the rows, so the genes and tissue marks inside a column are the
// domain's. Hovering a domain lights up its genes, and a gene its domain.
const {genes = [], domains = [], chromosome = "?", cell = "?"} = data || {};
const W = Math.max(640, fit?.width ?? 960);
const H = Math.max(420, fit?.height ?? 560);

// ---- sizes and colours -------------------------------------------------
const M = {top: 64, right: 16, bottom: 40, left: 112};
const ROW = 13, GAP = 3;          // a domain row
const LANE = 11;                  // a gene lane
const SYSTEM_COLOR = {
  "Gene expression": "#60a5fa", "Immune system": "#f472b6", "Transport": "#34d399",
  "Development": "#fbbf24", "Metabolism": "#a78bfa", "Cell cycle and DNA": "#f87171",
  "Senses": "#22d3ee", "Protein turnover": "#fb923c", "Cell structure and movement": "#a3e635",
  "Signalling": "#2dd4bf", "Cell death": "#e879f9", "Other processes": "#94a3b8", "Not annotated": "#3f3f46",
};
const DOMAIN_FILL = ["#1e3a5f", "#24507f", "#2f6aa3", "#3b82c4"];
const TISSUES = [...new Set(genes.flatMap((g) => g.enriched.map((e) => e.tissue)))].sort();
const organColor = d3.scaleOrdinal(TISSUES, d3.schemeTableau10.concat(d3.schemeSet3));
const NONSPECIFIC = "#3f3f46";
const LANDMARKS = [
  ["HOXA cluster", /^HOXA\d+$/], ["T-cell receptor γ", /^TRG[VJC]/], ["T-cell receptor β", /^TRB[VDJC]/],
  ["CFTR", /^CFTR$/], ["Taste receptors", /^TAS2R/], ["Zinc fingers (7q11)", /^ZNF(107|138|679|680|722|727|735|736)$/],
];

// ---- layout ----------------------------------------------------------------
const len = d3.max(domains.concat(genes), (d) => d.end) || 1;
const depthMax = d3.max(domains, (d) => d.depth) ?? 0;
const domTop = M.top, domH = (depthMax + 1) * (ROW + GAP);
// genes in lanes, so overlapping genes don't hide each other (bp, 15 kb apart)
const laneEnd = [];
for (const g of genes) {
  let l = laneEnd.findIndex((e) => e + 15000 < g.start);
  if (l < 0) { l = laneEnd.length; laneEnd.push(0); }
  laneEnd[l] = g.end; g._lane = l;
}
const lanes = Math.min(laneEnd.length, 6);
const geneTop = domTop + domH + 26, geneH = lanes * (LANE + 2);
const organTop = geneTop + geneH + 22;
const ORGAN_ROW = 10;
// tissues by how many of the chromosome's genes are specific to them; as many rows as fit
const byTissue = d3.rollups(genes.flatMap((g) => g.enriched.map((e) => e.tissue)), (v) => v.length, (t) => t)
  .sort((a, b) => b[1] - a[1]);
const organRows = byTissue.slice(0, Math.max(6, Math.floor((H - organTop - M.bottom) / ORGAN_ROW))).map(([t]) => t);
const rowOf = new Map(organRows.map((t, i) => [t, i]));
const organTicks = genes.flatMap((g) => g.enriched.filter((e) => rowOf.has(e.tissue)).map((e) => ({g, tissue: e.tissue, ntpm: e.ntpm})));
const plotH = Math.max(organTop + organRows.length * ORGAN_ROW + M.bottom, H);

const x0 = d3.scaleLinear([0, len], [M.left, W - M.right]);
let x = x0.copy();
let mode = "function", focus = null, pinned = null, hot = null; // hot: the domain under the pointer
const fillOf = (g) => mode === "function" ? SYSTEM_COLOR[g.system] || "#94a3b8"
  : (g.enriched[0] ? organColor(g.enriched[0].tissue) : NONSPECIFIC);

const root = document.createElement("div");
root.style.cssText = `position:relative;width:${W}px;font:12px system-ui,sans-serif;color:#e4e4e7`;
const bar = document.createElement("div");
bar.style.cssText = "display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:2px 0 4px " + M.left + "px";
root.append(bar);
const btn = (label, on) => { const b = document.createElement("button"); b.textContent = label;
  b.style.cssText = "padding:2px 8px;border:1px solid #52525b;border-radius:4px;background:#18181b;color:#e4e4e7;cursor:pointer";
  b.onclick = on; bar.append(b); return b; };
const colourBtn = btn("Colour: function", () => { mode = mode === "function" ? "organ" : "function";
  colourBtn.textContent = mode === "function" ? "Colour: function" : "Colour: organ"; drawLegend(); redraw(); });
btn("Whole chromosome", () => zoomTo(0, len));
const find = document.createElement("input");
find.placeholder = "Find a gene (e.g. CFTR)"; find.setAttribute("list", "gm-genes");
find.style.cssText = "padding:2px 6px;border:1px solid #52525b;border-radius:4px;background:#09090b;color:#e4e4e7;width:180px";
const list = document.createElement("datalist"); list.id = "gm-genes";
for (const g of genes) { const o = document.createElement("option"); o.value = g.gene; list.append(o); }
find.onchange = () => { const g = genes.find((d) => d.gene.toLowerCase() === find.value.trim().toLowerCase());
  if (g) { zoomTo(g.start - 400000, g.end + 400000); pin(g); } };
bar.append(find, list);
const status = document.createElement("span"); status.style.cssText = "color:#a1a1aa"; bar.append(status);

const how = document.createElement("div");
how.style.cssText = `margin:0 0 2px ${M.left}px;color:#a1a1aa;font-size:11px`;
how.textContent = `Every row shares the axis: position on chromosome ${chromosome} (GRCh38). A bar spans a gene from start to end; genes that overlap or lie within 15 kb of each other stack into lanes (the lane means nothing else). Shaded columns are domains: what lies in a column lies in that domain. Hover a domain to light up its genes.`;
root.append(how);
const svg = d3.select(root).append("svg").attr("width", W).attr("height", plotH).style("display", "block");
const tip = d3.select(root).append("div")
  .style("position", "absolute").style("pointer-events", "none").style("display", "none")
  .style("background", "#09090b").style("border", "1px solid #3f3f46").style("border-radius", "6px")
  .style("padding", "6px 8px").style("max-width", "340px").style("line-height", "1.35");
const card = d3.select(root).append("div")
  .style("position", "absolute").style("right", "4px").style("top", "34px").style("display", "none")
  .style("background", "#09090b").style("border", "1px solid #52525b").style("border-radius", "6px")
  .style("padding", "8px 10px").style("width", "300px").style("line-height", "1.4").style("z-index", 2);

// ---- row labels --------------------------------------------------------------
const labels = svg.append("g").attr("fill", "#a1a1aa").attr("font-size", 11);
labels.append("text").attr("x", 6).attr("y", domTop + 10).text(`Domains (${domains.length})`);
labels.append("text").attr("x", 6).attr("y", domTop + 24).attr("font-size", 10).text(`${cell} Hi-C, nested ↓`);
labels.append("text").attr("x", 6).attr("y", geneTop + 10).text(`Genes (${genes.length})`);
labels.append("text").attr("x", 6).attr("y", geneTop + 24).attr("font-size", 10).text("at their position;");
labels.append("text").attr("x", 6).attr("y", geneTop + 36).attr("font-size", 10).text("close ones stack");
const inDomain = genes.filter((g) => g.domain).length;
labels.append("text").attr("x", 6).attr("y", geneTop + 50).attr("font-size", 10).text(`${inDomain} in a domain`);
labels.append("text").attr("x", 6).attr("y", organTop - 6).text("Specific to");
labels.selectAll("text.t").data(organRows).join("text").attr("class", "t").attr("font-size", 9)
  .attr("x", M.left - 6).attr("text-anchor", "end").attr("y", (t, i) => organTop + i * ORGAN_ROW + 8)
  .text((t) => `${t} ${byTissue.find(([x]) => x === t)[1]}`);

// everything on the track is clipped to the plot, not the labels
svg.append("clipPath").attr("id", "gm-clip").append("rect")
  .attr("x", M.left).attr("y", 0).attr("width", W - M.left - M.right).attr("height", plotH);
const axisG = svg.append("g").attr("transform", "translate(0,22)").attr("color", "#71717a");
const marks = svg.append("g").attr("clip-path", "url(#gm-clip)");
const clipped = () => svg.append("g").attr("clip-path", "url(#gm-clip)");
const domG = clipped(), geneG = clipped(), nameG = clipped(), organG = clipped();
svg.insert("g", ":first-child").selectAll("rect").data(organRows).join("rect")
  .attr("x", M.left).attr("width", W - M.left - M.right).attr("y", (t, i) => organTop + i * ORGAN_ROW - 1)
  .attr("height", ORGAN_ROW).attr("fill", "#27272a").attr("opacity", (t, i) => (i % 2 ? 0.25 : 0.5));
const colG = svg.insert("g", "g").attr("clip-path", "url(#gm-clip)").attr("pointer-events", "none");
const colBottom = organTop + organRows.length * ORGAN_ROW;
const outer = domains.filter((d) => d.depth === 0);
const mini = svg.append("g").attr("transform", `translate(0,${plotH - 22})`);

// ---- hover and pin ------------------------------------------------------------
const fmtMb = (bp) => (bp / 1e6).toFixed(2) + " Mb";
const show = (event, html) => { const [px, py] = d3.pointer(event, root);
  tip.style("display", "block").html(html)
    .style("left", Math.min(px + 14, W - 350) + "px").style("top", (py + 14) + "px"); };
const hide = () => tip.style("display", "none");
const geneHtml = (g) => `<b>${g.gene}</b> · ${g.description || ""}<br>
  chr${chromosome}:${g.start.toLocaleString()}–${g.end.toLocaleString()} (${g.length_kb} kb)<br>
  <span style="color:${SYSTEM_COLOR[g.system]}">■</span> ${g.system} › ${g.process}
  ${g.processes.length > 1 ? `<br><span style="color:#a1a1aa">also: ${g.processes.filter((p) => p !== g.process).join(", ")}</span>` : ""}
  ${g.functions.length ? `<br><span style="color:#a1a1aa">function: ${g.functions.join(", ")}</span>` : ""}<br>
  Domain: ${g.domain ? `${g.domain_label} (${g.domain_kb} kb)` : "<i>between domains</i>"}<br>
  RNA: ${g.specificity || "?"}${g.enriched.length ? ` · ${g.enriched.map((e) => `${e.tissue} ${e.ntpm} nTPM`).join(", ")}` : ""}
  ${g.top_tissue ? `<br><span style="color:#a1a1aa">highest: ${g.top_tissue} (${g.top_ntpm} nTPM)</span>` : ""}`;
const pin = (g) => {
  pinned = g;
  const bars = Object.entries(g.tissues).filter(([, v]) => v != null).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const top = bars[0]?.[1] || 1;
  card.style("display", "block").html(`<div style="display:flex;justify-content:space-between">
      <b style="font-size:14px">${g.gene}</b><span data-close style="cursor:pointer;color:#a1a1aa;font-size:16px">×</span></div>
    ${geneHtml(g)}
    <div style="margin-top:6px;color:#a1a1aa">RNA by tissue (HPA, nTPM)</div>
    ${bars.map(([t, v]) => `<div style="display:flex;gap:6px;align-items:center"><span style="width:96px">${t}</span>
      <span style="display:inline-block;height:8px;width:${Math.max(1, 150 * v / top)}px;background:${organColor(t)}"></span>
      <span style="color:#a1a1aa">${v}</span></div>`).join("")}
    <div style="margin-top:6px;display:flex;gap:10px;flex-wrap:wrap">
      <a target="_blank" rel="noopener" style="color:#60a5fa" href="https://www.proteinatlas.org/${g.ensembl}-${g.gene}">HPA</a>
      <a target="_blank" rel="noopener" style="color:#60a5fa" href="https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${g.ensembl}">Ensembl</a>
      <a target="_blank" rel="noopener" style="color:#60a5fa" href="https://www.genecards.org/cgi-bin/carddisp.pl?gene=${g.gene}">GeneCards</a>
      <a target="_blank" rel="noopener" style="color:#60a5fa" href="https://reactome.org/content/query?q=${g.gene}&species=Homo+sapiens">Reactome pathways</a>
    </div>`);
  card.select("[data-close]").on("click", () => { pinned = null; card.style("display", "none"); redraw(); });
  redraw();
};

// ---- zoom ----------------------------------------------------------------------
const zoom = d3.zoom().scaleExtent([1, 4000])
  .translateExtent([[M.left, 0], [W - M.right, plotH]]).extent([[M.left, 0], [W - M.right, plotH]])
  .filter((e) => !e.button && e.type !== "dblclick")
  .on("zoom", (e) => { x = e.transform.rescaleX(x0); redraw(); });
svg.call(zoom);
// zoom so that [a, b] (bp) fills the plot: the transform maps x0(a) to the left edge
function zoomTo(a, b) {
  a = Math.max(0, a); b = Math.min(len, b);
  const k = Math.min(4000, (W - M.right - M.left) / Math.max(1, x0(b) - x0(a)));
  svg.transition().duration(650).call(zoom.transform, d3.zoomIdentity.translate(M.left - k * x0(a), 0).scale(k));
}

// ---- landmarks: named loci to start from ------------------------------------------
const land = LANDMARKS.map(([name, re]) => { const gs = genes.filter((g) => re.test(g.gene));
  return gs.length ? {name, start: d3.min(gs, (g) => g.start), end: d3.max(gs, (g) => g.end), n: gs.length} : null; })
  .filter(Boolean).sort((a, b) => a.start - b.start)
  // neighbours alternate between two heights, so their names don't collide
  .map((d, i) => ({...d, y: i % 2 ? 36 : 48}));

// ---- legend ----------------------------------------------------------------------
const legend = d3.select(root).append("div").style("display", "flex").style("flex-wrap", "wrap")
  .style("gap", "4px 12px").style("margin", "2px 0 0 " + M.left + "px");
function drawLegend() {
  const items = mode === "function"
    ? Object.keys(SYSTEM_COLOR).map((s) => [s, SYSTEM_COLOR[s], genes.filter((g) => g.system === s).length])
    : TISSUES.map((t) => [t, organColor(t), genes.filter((g) => g.enriched[0]?.tissue === t).length])
        .sort((a, b) => b[2] - a[2]).concat([["not specific", NONSPECIFIC, genes.filter((g) => !g.enriched.length).length]]);
  legend.selectAll("*").remove();
  for (const [name, c, n] of items) {
    if (!n) continue;
    const it = legend.append("span").style("cursor", "pointer").style("opacity", focus && focus !== name ? 0.4 : 1)
      .attr("title", mode === "function" ? "Click: highlight this system's genes" : "Click: highlight genes specific to this tissue")
      .html(`<span style="color:${c}">■</span> ${name} <span style="color:#71717a">${n}</span>`);
    it.on("click", () => { focus = focus === name ? null : name; drawLegend(); redraw(); });
  }
}
let hotGene = null;
// a gene is in the hovered domain when its middle lies in it (the domain or one nested inside)
const inHot = (g) => !hot || ((g.start + g.end) / 2 >= hot.start && (g.start + g.end) / 2 <= hot.end);
const inFocus = (g) => !focus || (mode === "function" ? g.system === focus
  : focus === "not specific" ? !g.enriched.length : g.enriched.some((e) => e.tissue === focus));

// ---- drawing -----------------------------------------------------------------------
function redraw() {
  const [a, b] = x.domain();
  const visible = (d) => d.end >= a && d.start <= b;
  const span = b - a;
  axisG.call(d3.axisTop(x).ticks(Math.max(3, W / 110)).tickFormat((v) => (v / 1e6).toFixed(span < 3e6 ? 2 : 0) + " Mb"));
  status.textContent = `chr${chromosome}:${(a / 1e6).toFixed(2)}–${(b / 1e6).toFixed(2)} Mb · ${genes.filter(visible).length} genes, ${domains.filter(visible).length} domains in view`;

  // a shaded column per outermost domain, through genes and tissues; the
  // hovered domain's (or the hovered gene's) column brighter
  const hotSpan = hot || (hotGene && domains.find((d) => d.id === hotGene.domain));
  colG.selectAll("rect.col").data(outer.filter(visible), (d) => d.id).join("rect").attr("class", "col")
    .attr("x", (d) => x(d.start)).attr("width", (d) => Math.max(1, x(d.end) - x(d.start)))
    .attr("y", domTop - 2).attr("height", colBottom - domTop + 4)
    .attr("fill", "#3b82c4").attr("opacity", (d, i) => (i % 2 ? 0.07 : 0.11));
  colG.selectAll("rect.hot").data(hotSpan ? [hotSpan] : []).join("rect").attr("class", "hot").attr("pointer-events", "none")
    .attr("x", (d) => x(d.start)).attr("width", (d) => Math.max(1, x(d.end) - x(d.start)))
    .attr("y", domTop - 2).attr("height", colBottom - domTop + 4)
    .attr("fill", "#93c5fd").attr("opacity", 0.18).attr("stroke", "#93c5fd").attr("stroke-opacity", 0.6);

  // landmarks above the domains
  marks.selectAll("g").data(land.filter(visible), (d) => d.name).join((en) => {
    const g = en.append("g").style("cursor", "pointer");
    g.append("line").attr("stroke", "#a1a1aa").attr("y2", M.top - 3);
    g.append("text").attr("fill", "#e4e4e7").attr("font-size", 10).attr("text-anchor", "middle");
    g.on("click", (e, d) => zoomTo(d.start - 150000, d.end + 150000))
     .on("mousemove", (e, d) => show(e, `<b>${d.name}</b><br>${d.n} genes, ${fmtMb(d.start)}–${fmtMb(d.end)}<br><i>click to zoom</i>`))
     .on("mouseleave", hide);
    return g;
  }).each(function (d) { const cx = x((d.start + d.end) / 2), y = d.y;
    d3.select(this).select("line").attr("x1", cx).attr("x2", cx).attr("y1", y + 2);
    d3.select(this).select("text").attr("x", cx).attr("y", y).text(d.name); });

  // domains: one row per nesting depth
  domG.selectAll("rect").data(domains.filter(visible), (d) => d.id).join((en) => en.append("rect")
      .attr("rx", 2).style("cursor", "pointer")
      .on("click", (e, d) => zoomTo(d.start - (d.end - d.start) * 0.15, d.end + (d.end - d.start) * 0.15))
      .on("mousemove", (e, d) => show(e, `<b>Domain ${d.label}</b> (${d.size_kb} kb)<br>
          depth ${d.depth}${d.parent ? " (inside a larger domain)" : ""} · ${d.children} inside it<br>
          ${d.genes} genes${d.genes ? `: ${d.gene_names.split(", ").slice(0, 12).join(", ")}${d.genes > 12 ? " …" : ""}` : ""}<br>
          ${d.top_system ? `most: ${d.top_system} (${Math.round(100 * d.top_share)}% of ${d.annotated} annotated)` : "no annotated genes"}<br>
          <span style="color:#a1a1aa">Arrowhead score ${d.score.toFixed(2)} · click to zoom</span>`))
      .on("mouseenter", (e, d) => { hot = d; redraw(); })
      .on("mouseleave", () => { hide(); hot = null; redraw(); }))
    .attr("x", (d) => x(d.start)).attr("width", (d) => Math.max(1, x(d.end) - x(d.start)))
    .attr("y", (d) => domTop + d.depth * (ROW + GAP)).attr("height", ROW)
    .attr("fill", (d) => DOMAIN_FILL[Math.min(d.depth, DOMAIN_FILL.length - 1)])
    .attr("stroke", (d) => ((pinned && pinned.domain === d.id) || hotGene?.domain === d.id || hot === d ? "#fafafa" : "#0b1220"))
    .attr("opacity", (d) => (!focus || genes.some((g) => g.domain === d.id && inFocus(g)) ? 1 : 0.35));

  // genes: lanes; the pinned one outlined
  const vg = genes.filter(visible);
  geneG.selectAll("rect").data(vg, (d) => d.gene).join((en) => en.append("rect").style("cursor", "pointer")
      .on("click", (e, d) => pin(d))
      .on("mousemove", (e, d) => show(e, geneHtml(d) + `<br><span style="color:#a1a1aa">click to pin</span>`))
      .on("mouseenter", (e, d) => { hotGene = d; redraw(); })
      .on("mouseleave", () => { hide(); hotGene = null; redraw(); }))
    .attr("x", (d) => x(d.start)).attr("width", (d) => Math.max(1.5, x(d.end) - x(d.start)))
    .attr("y", (d) => geneTop + Math.min(d._lane, lanes - 1) * (LANE + 2)).attr("height", LANE)
    .attr("fill", fillOf).attr("opacity", (d) => (inFocus(d) && inHot(d) ? 1 : 0.15))
    .attr("stroke", (d) => (pinned === d ? "#fafafa" : "none")).attr("stroke-width", 1.5);

  // names where there is room for them
  let lastX = -Infinity;
  const named = span < 6e6 ? vg.filter((g) => { const cx = x(g.start); if (cx - lastX < 52) return false; lastX = cx; return true; }) : [];
  nameG.selectAll("text").data(named, (d) => d.gene).join("text")
    .attr("font-size", 10).attr("fill", "#d4d4d8").attr("y", geneTop - 4)
    .attr("x", (d) => Math.max(M.left, x(d.start))).text((d) => d.gene);

  // organ ticks: genes whose RNA is specific to a tissue
  organG.selectAll("rect").data(organTicks.filter((t) => visible(t.g)), (d) => d.g.gene + "|" + d.tissue).join((en) => en.append("rect")
      .on("mousemove", (e, d) => show(e, `<b>${d.g.gene}</b> in ${d.tissue}: ${d.ntpm} nTPM<br>${d.g.specificity}: ${d.g.enriched.map((t) => t.tissue).join(", ")}<br><span style="color:#a1a1aa">${d.g.system} › ${d.g.process}</span>`))
      .on("mouseleave", hide).on("click", (e, d) => pin(d.g)).style("cursor", "pointer"))
    .attr("x", (d) => x(d.g.start)).attr("width", (d) => Math.max(2, x(d.g.end) - x(d.g.start)))
    .attr("y", (d) => organTop + rowOf.get(d.tissue) * ORGAN_ROW).attr("height", ORGAN_ROW - 2)
    .attr("fill", (d) => (mode === "function" ? SYSTEM_COLOR[d.g.system] || "#94a3b8" : organColor(d.tissue)))
    .attr("opacity", (d) => (inFocus(d.g) && inHot(d.g) ? 1 : 0.15));

  // the whole chromosome below, with the part in view
  const mx = d3.scaleLinear([0, len], [M.left, W - M.right]);
  mini.selectAll("rect.all").data([0]).join("rect").attr("class", "all")
    .attr("x", M.left).attr("width", W - M.right - M.left).attr("height", 8).attr("fill", "#27272a")
    .style("cursor", "pointer").on("click", (e) => { const c = mx.invert(d3.pointer(e, svg.node())[0]); zoomTo(c - span / 2, c + span / 2); });
  mini.selectAll("rect.view").data([0]).join("rect").attr("class", "view").attr("pointer-events", "none")
    .attr("x", mx(a)).attr("width", Math.max(2, mx(b) - mx(a))).attr("y", -2).attr("height", 12)
    .attr("fill", "none").attr("stroke", "#fafafa");
  mini.selectAll("text").data([0]).join("text").attr("x", 6).attr("y", 8).attr("fill", "#a1a1aa").attr("font-size", 10)
    .text(`chr${chromosome}, ${(len / 1e6).toFixed(0)} Mb`);
}

drawLegend();
redraw();
return root;