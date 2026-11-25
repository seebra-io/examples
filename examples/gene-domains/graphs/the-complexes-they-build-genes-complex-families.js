// The chromosome's genes and the protein complexes they build. Circles are
// the chromosome's genes (coloured by their own system), squares are
// complex families (variants that differ in a subunit are one family; size:
// how many complexes), coloured by what the complex does. A line: the gene
// encodes a subunit of a complex in that family.
// Hover for what it is; click a family to list its complexes, members and
// functions on the right; click one of a complex's PDB entries there to load
// that structure (it sets the board's complex and pdb parameters: the next
// slide). An entry can hold the whole complex or only part of it.
const {complexes = [], genes = 0, genes_in_complexes = 0, chromosome = "?"} = data || {};
const W = Math.max(720, fit?.width ?? 1000), H = Math.max(460, fit?.height ?? 620);
const PANEL = Math.min(360, Math.round(W * 0.34));
const GW = W - PANEL - 12;
const COLOR = {
  "Gene expression": "#60a5fa", "Immune system": "#f472b6", "Transport": "#34d399",
  "Development": "#fbbf24", "Metabolism": "#a78bfa", "Cell cycle and DNA": "#f87171",
  "Senses": "#22d3ee", "Protein turnover": "#fb923c", "Cell structure and movement": "#a3e635",
  "Signalling": "#2dd4bf", "Cell death": "#e879f9", "Other processes": "#94a3b8", "Not annotated": "#52525b",
};
const col = (s) => COLOR[s] || "#94a3b8";

// families of complexes, and the chromosome's genes in them
const fams = d3.groups(complexes, (c) => c.family).map(([name, cs]) => ({
  kind: "family", id: "f:" + name, name, complexes: cs,
  system: d3.greatest(d3.rollups(cs, (v) => v.length, (c) => c.system), (d) => d[1])[0],
  here: [...new Set(cs.flatMap((c) => c.here))],
}));
const geneSystem = new Map();
for (const c of complexes) for (const m of c.members) if (m.here && !geneSystem.has(m.gene)) geneSystem.set(m.gene, null);
const geneNodes = [...new Set(fams.flatMap((f) => f.here))].map((g) => ({kind: "gene", id: "g:" + g, name: g,
  families: fams.filter((f) => f.here.includes(g))}));
const nodes = [...fams, ...geneNodes];
const links = fams.flatMap((f) => f.here.map((g) => ({source: f.id, target: "g:" + g})));
const r = (d) => (d.kind === "family" ? 4 + 2.4 * Math.sqrt(d.complexes.length) : 3.2);

// families gather by what they do: one place per system, around a circle,
// labelled; a gene sits between the families it is in
const systems = d3.groupSort(fams, (v) => -v.length, (f) => f.system);
const ang = d3.scaleBand(systems, [0, 2 * Math.PI]);
const R = Math.min(GW, H) * 0.32;
const home = (s) => [GW / 2 + R * Math.cos(ang(s)), H / 2 + 12 + R * Math.sin(ang(s))];
for (const f of fams) [f.hx, f.hy] = home(f.system);
const sim = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id((d) => d.id).distance(22).strength(0.6))
  .force("charge", d3.forceManyBody().strength((d) => (d.kind === "family" ? -60 : -18)))
  .force("x", d3.forceX((d) => d.hx ?? GW / 2).strength((d) => (d.kind === "family" ? 0.35 : 0.01)))
  .force("y", d3.forceY((d) => d.hy ?? H / 2).strength((d) => (d.kind === "family" ? 0.35 : 0.01)))
  .force("collide", d3.forceCollide((d) => r(d) + 1.5)).stop();
for (let i = 0; i < 400; i++) sim.tick();
// fit the layout into the box
const xs = d3.extent(nodes, (d) => d.x), ys = d3.extent(nodes, (d) => d.y);
const k = Math.min((GW - 40) / (xs[1] - xs[0] || 1), (H - 80) / (ys[1] - ys[0] || 1), 2.2);
for (const d of nodes) { d.x = 20 + (d.x - xs[0]) * k + ((GW - 40) - (xs[1] - xs[0]) * k) / 2; d.y = 46 + (d.y - ys[0]) * k; }

const root = document.createElement("div");
root.style.cssText = `position:relative;width:${W}px;height:${H}px;font:12px system-ui,sans-serif;color:#e4e4e7;display:flex;gap:12px`;
const svg = d3.select(root).append("svg").attr("width", GW).attr("height", H).style("flex", "none");
svg.append("text").attr("x", 8).attr("y", 16).attr("fill", "#a1a1aa").attr("font-size", 12)
  .text(`${genes_in_complexes} of ${genes} genes on chromosome ${chromosome} are subunits of ${complexes.length} curated complexes (${fams.length} families). Circles: genes; squares: complex families.`);
svg.append("text").attr("x", 8).attr("y", 32).attr("fill", "#71717a").attr("font-size", 11)
  .text("Complex Portal (EBI) holds curated complexes only: a gene not here may still bind partners. Click a square for its complexes.");

// each system's name, at its families' middle
svg.append("g").selectAll("text").data(systems).join("text")
  // outside the cluster, away from the middle
  .attr("x", (sy) => { const fs = fams.filter((f) => f.system === sy), cx = d3.mean(fs, (f) => f.x);
    return Math.max(70, Math.min(GW - 70, cx + Math.sign(cx - GW / 2) * 30)); })
  .attr("y", (sy) => { const fs = fams.filter((f) => f.system === sy), cy = d3.mean(fs, (f) => f.y);
    return cy < H / 2 ? d3.min(fs, (f) => f.y) - 12 : d3.max(fs, (f) => f.y) + 22; })
  .attr("text-anchor", "middle").attr("paint-order", "stroke").attr("stroke", "#09090b").attr("stroke-width", 4).attr("font-size", 12).attr("font-weight", 600).attr("fill", (sy) => col(sy))
  .text((sy) => `${sy} (${fams.filter((f) => f.system === sy).length})`);
const linkSel = svg.append("g").attr("stroke", "#3f3f46").selectAll("line").data(links).join("line")
  .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
const nodeSel = svg.append("g").selectAll("g").data(nodes).join("g")
  .attr("transform", (d) => `translate(${d.x},${d.y})`).style("cursor", "pointer");
nodeSel.filter((d) => d.kind === "family").append("rect")
  .attr("x", (d) => -r(d)).attr("y", (d) => -r(d)).attr("width", (d) => 2 * r(d)).attr("height", (d) => 2 * r(d)).attr("rx", 2)
  .attr("fill", (d) => col(d.system)).attr("stroke", "#09090b");
nodeSel.filter((d) => d.kind === "gene").append("circle").attr("r", r).attr("fill", "#e4e4e7").attr("stroke", "#09090b");
// names: the larger families, and genes in three or more families
nodeSel.filter((d) => (d.kind === "family" && d.complexes.length >= 4) || (d.kind === "gene" && d.families.length >= 3))
  .append("text").attr("x", (d) => r(d) + 3).attr("y", 4).attr("font-size", (d) => (d.kind === "family" ? 10 : 9))
  .attr("fill", (d) => (d.kind === "family" ? "#e4e4e7" : "#a1a1aa")).attr("paint-order", "stroke").attr("stroke", "#09090b").attr("stroke-width", 3)
  .text((d) => (d.kind === "family" ? (d.name.length > 34 ? d.name.slice(0, 32) + "…" : d.name) : d.name));

seebra.tooltip.attach(nodeSel, (d) => d.kind === "family"
  ? `<b>${d.name}</b><br><span style="color:${col(d.system)}">■</span> ${d.system}<br>${d.complexes.length} complex${d.complexes.length > 1 ? "es" : ""}; from chromosome ${chromosome}: ${d.here.join(", ")}<br><span style="color:#a1a1aa">click for its complexes</span>`
  : `<b>${d.name}</b> (chromosome ${chromosome})<br>a subunit in ${d.families.length} famil${d.families.length > 1 ? "ies" : "y"}: ${d.families.slice(0, 6).map((f) => f.name).join("; ")}${d.families.length > 6 ? " …" : ""}`);

// the panel: the selected family's complexes
const panel = document.createElement("div");
panel.style.cssText = `width:${PANEL}px;height:${H}px;overflow:auto;border-left:1px solid #27272a;padding:6px 4px 6px 12px;box-sizing:border-box;line-height:1.4`;
root.append(panel);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
function highlight(f) {
  const on = f ? new Set([f.id, ...f.here.map((g) => "g:" + g)]) : null;
  nodeSel.attr("opacity", (d) => (!on || on.has(d.id) ? 1 : 0.4));
  linkSel.attr("stroke", (d) => (on && d.source.id === f.id ? "#a1a1aa" : "#3f3f46")).attr("opacity", (d) => (!on || d.source.id === f.id ? 1 : 0.2));
}
function show(f) {
  highlight(f);
  if (!f) { panel.innerHTML = `<div style="color:#a1a1aa">Click a square: a family of complexes. Its complexes, their subunits, what they do and their 3D structure show here.</div>`; return; }
  const current = parameters?.complex;
  panel.innerHTML = `<div style="font-size:14px;font-weight:600">${esc(f.name)}</div>
    <div><span style="color:${col(f.system)}">■</span> ${esc(f.system)} · ${f.complexes.length} complex${f.complexes.length > 1 ? "es" : ""}</div>` +
    f.complexes.map((c) => `<div data-cx="${esc(c.id)}" style="margin-top:10px;padding:6px;border:1px solid ${c.id === current ? "#fafafa" : "#27272a"};border-radius:6px">
      <div style="font-weight:600">${esc(c.name)}</div>
      <div style="color:#a1a1aa">${c.subunits} different subunits, ${c.copies} copies · ${esc(c.id)} · evidence ${esc(c.evidence || "?")}</div>
      <div style="margin-top:3px">${c.members.map((m) => `<span title="${esc(m.uniprot)}, ×${m.stoichiometry || "?"}" style="${m.here ? "font-weight:700;color:#fafafa" : "color:#a1a1aa"}">${esc(m.gene)}<sup>${m.here ? chromosome : esc(m.chromosome)}</sup></span>`).join(" ")}</div>
      ${c.go.length ? `<div style="margin-top:3px;color:#d4d4d8">${c.go.slice(0, 5).map(esc).join(" · ")}</div>` : ""}
      ${c.description ? `<div style="margin-top:3px;color:#a1a1aa">${esc(c.description.slice(0, 260))}${c.description.length > 260 ? "…" : ""}</div>` : ""}
      <div style="margin-top:4px;display:flex;gap:10px;flex-wrap:wrap">
        ${c.pdb.length ? `<span style="color:#a1a1aa">3D:</span>` + c.pdb.slice(0, 10).map((p) => `<button data-pdb="${esc(p)}" data-id="${esc(c.id)}" title="Load PDB ${esc(p.toUpperCase())} on the next slide; entries can hold only part of the complex" style="padding:0 6px;border:1px solid ${p === parameters?.pdb && c.id === current ? "#fafafa" : "#52525b"};border-radius:4px;background:#18181b;color:#e4e4e7;cursor:pointer">${esc(p.toUpperCase())}</button>`).join("") + (c.pdb.length > 10 ? `<span style="color:#71717a">+${c.pdb.length - 10}</span>` : "") : `<span style="color:#71717a">no experimental structure</span>`}
        <a href="${esc(c.url)}" target="_blank" rel="noopener" style="color:#60a5fa">Complex Portal</a>
      </div></div>`).join("") +
    `<div style="margin-top:10px;color:#71717a">Superscript: the chromosome that encodes the subunit. Bold: on chromosome ${chromosome}.</div>`;
  for (const b of panel.querySelectorAll("button[data-pdb]"))
    b.onclick = () => { setParameter({complex: b.dataset.id, pdb: b.dataset.pdb}); b.textContent = b.dataset.pdb.toUpperCase() + ": loading, see the next slide"; };
}
nodeSel.on("click", (e, d) => show(d.kind === "family" ? d : (d.families[0] || null)));
// the family of the complex selected now, else the largest
show(fams.find((f) => f.complexes.some((c) => c.id === parameters?.complex)) || d3.greatest(fams, (f) => f.here.length) || null);
return root;