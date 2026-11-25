// What the chromosome's genes do, as a hierarchy you can zoom: system ›
// process (UniProt keyword; HPA's protein class for genes without one) ›
// gene. Width is the number of genes. Click a box to zoom into it, click the
// left column to go back up. Hover a gene for its domain and organs.
const {genes = [], chromosome = "?"} = data || {};
const W = Math.max(640, fit?.width ?? 960);
const H = Math.max(420, fit?.height ?? 560);

// ---- colours (as on the chromosome track) ------------------------------------
const SYSTEM_COLOR = {
  "Gene expression": "#60a5fa", "Immune system": "#f472b6", "Transport": "#34d399",
  "Development": "#fbbf24", "Metabolism": "#a78bfa", "Cell cycle and DNA": "#f87171",
  "Senses": "#22d3ee", "Protein turnover": "#fb923c", "Cell structure and movement": "#a3e635",
  "Signalling": "#2dd4bf", "Cell death": "#e879f9", "Other processes": "#94a3b8", "Not annotated": "#52525b",
};
const LEVELS = 3;                    // system, process, gene (below the chromosome)

// ---- the hierarchy ----------------------------------------------------------------
const tree = {name: `chr${chromosome}`, children: []};
for (const [system, gs] of d3.group(genes, (g) => g.system)) {
  tree.children.push({name: system, system, children: [...d3.group(gs, (g) => g.process)].map(([p, pg]) =>
    ({name: p, system, children: pg.map((g) => ({name: g.gene, system, gene: g}))}))});
}
const root = d3.hierarchy(tree).count().sort((a, b) => b.value - a.value || d3.ascending(a.data.name, b.data.name));
d3.partition().size([H, LEVELS + 1])(root);
// partition gives y0/y1 in [0, H] (rows) and x0/x1 in depth units (columns)

// the focus is a narrow strip on the left; the columns below it share the rest
const STRIP = 64;
const colX = (level) => (level <= 0 ? 0 : STRIP + (level - 1) * (W - STRIP) / (LEVELS - focus.depth));
const colW = (level) => (level <= 0 ? STRIP : (W - STRIP) / (LEVELS - focus.depth));
const fill = (d) => { if (d.depth === 0) return "#27272a";
  const c = d3.color(SYSTEM_COLOR[d.data.system] || "#94a3b8"); return d.depth === 1 ? c : d.depth === 2 ? c.darker(0.6) : c.darker(1.1); };

const box = document.createElement("div");
box.style.cssText = `position:relative;width:${W}px;font:12px system-ui,sans-serif;color:#e4e4e7`;
const svg = d3.select(box).append("svg").attr("width", W).attr("height", H).style("display", "block");
const tip = d3.select(box).append("div").style("position", "absolute").style("pointer-events", "none")
  .style("display", "none").style("background", "#09090b").style("border", "1px solid #3f3f46")
  .style("border-radius", "6px").style("padding", "6px 8px").style("max-width", "320px").style("line-height", "1.35");

const show = (event, d) => {
  const g = d.data.gene;
  const html = g
    ? `<b>${g.gene}</b> · ${g.description || ""}<br>${g.system} › ${g.process}<br>
       Domain: ${g.domain ? `${g.domain_label} (${g.domain_kb} kb)` : "<i>between domains</i>"}<br>
       RNA: ${g.specificity || "?"}${g.enriched.length ? ` · ${g.enriched.map((e) => e.tissue).join(", ")}` : ""}<br>
       ${(g.start / 1e6).toFixed(2)} Mb on chr${chromosome}`
    : `<b>${d.ancestors().reverse().slice(1).map((a) => a.data.name).join(" › ") || d.data.name}</b><br>
       ${d.value} genes (${(100 * d.value / root.value).toFixed(1)}% of the chromosome's)<br>
       in a domain: ${d.leaves().filter((l) => l.data.gene?.domain).length} ·
       organ-specific: ${d.leaves().filter((l) => l.data.gene?.enriched.length).length}
       ${d.depth > 0 ? "<br><span style='color:#a1a1aa'>click to zoom in</span>" : ""}`;
  const [px, py] = d3.pointer(event, box);
  tip.style("display", "block").html(html).style("left", Math.min(px + 14, W - 330) + "px").style("top", (py + 14) + "px");
};

// ---- the boxes ------------------------------------------------------------------------
const cell = svg.selectAll("g").data(root.descendants()).join("g");
const rect = cell.append("rect").attr("fill", fill).attr("stroke", "#09090b").style("cursor", "pointer")
  .on("mousemove", show).on("mouseleave", () => tip.style("display", "none"))
  .on("click", (e, d) => clicked(d));
const text = cell.append("text").attr("fill", "#fafafa").attr("font-size", 11).attr("pointer-events", "none");
text.append("tspan").attr("class", "n");
text.append("tspan").attr("class", "v").attr("fill-opacity", 0.7);

let focus = root;
function place(t = 0) {
  const k = H / (focus.x1 - focus.x0);
  const at = (d) => { const l = d.depth - focus.depth;
    return {x: l < 0 ? -STRIP : colX(l), w: l < 0 ? 0 : colW(l), y: (d.x0 - focus.x0) * k, h: (d.x1 - d.x0) * k}; };
  (t ? rect.transition().duration(t) : rect)
    .attr("x", (d) => at(d).x).attr("y", (d) => at(d).y)
    .attr("width", (d) => Math.max(0, at(d).w - 1)).attr("height", (d) => (at(d).h > 2 ? at(d).h - 1 : at(d).h));
  text.attr("x", (d) => at(d).x + 4).attr("y", (d) => at(d).y + 13)
    .attr("display", (d) => (at(d).h > 14 && at(d).x >= 0 && at(d).x < W ? null : "none"));
  text.select(".n").text((d) => d.data.name.length > 34 ? d.data.name.slice(0, 33) + "…" : d.data.name);
  text.select(".v").text((d) => (d.data.gene ? "" : ` ${d.value}`));
}
function clicked(d) {
  // the left column goes up a level; any other box zooms into it
  focus = (d === focus && d.parent) ? d.parent : (d.data.gene ? d.parent : d);
  place(650);
}
place();
return box;