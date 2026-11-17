// The year as a clock (January at the top, clockwise). Each arrow points at a species' mean
// date (circular mean of its records' months); its length is R, how concentrated the season is
// (1: all in one month, 0: spread evenly). Hollow dots: the same corrected for effort (weighted
// by enrichment, the share over all fungi's share). Hover for the numbers; click for GBIF's map.
// data: season {species, latin, taxon_key, records, mean_pos, r, corrected_pos, corrected_r, link, map}
const rows = (Array.isArray(data) ? data : []).filter(d => d.species !== "All fungi");
const base = (Array.isArray(data) ? data : []).find(d => d.species === "All fungi");
const colors = {"All fungi": "#a1a1aa", "Chanterelle": "#f59e0b", "Funnel chanterelle": "#a16207", "Porcini": "#b45309", "Fly agaric": "#ef4444", "False morel": "#8b5cf6"};
const W = Math.max(360, Math.min(fit?.width ?? 560, (fit?.height ?? 560) - 20)), R0 = W / 2 - 46;
const svg = d3.create("svg").attr("viewBox", [-W / 2, -W / 2, W, W]).attr("width", W).attr("height", W).style("font", "11px sans-serif");
const ang = pos => pos / 12 * 2 * Math.PI;            // months since 1 Jan -> angle
const xy = (pos, r) => [Math.sin(ang(pos)) * r * R0, -Math.cos(ang(pos)) * r * R0];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const date = pos => { const d = new Date(Date.UTC(2025, 0, 1) + pos * 30.44 * 864e5); return d.toLocaleDateString("en-GB", {day: "numeric", month: "short", timeZone: "UTC"}); };
for (const r of [0.25, 0.5, 0.75, 1]) svg.append("circle").attr("r", r * R0).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", r === 1 ? 0.35 : 0.12);
svg.append("text").attr("x", 4).attr("y", -R0 * 0.5 - 2).attr("fill", "currentColor").attr("fill-opacity", 0.5).text("R = 0.5");
months.forEach((m, i) => {
  const [x0, y0] = xy(i, 1), [x1, y1] = xy(i, 1.06), [tx, ty] = xy(i + 0.5, 1.13);
  svg.append("line").attr("x1", x0).attr("y1", y0).attr("x2", x1).attr("y2", y1).attr("stroke", "currentColor").attr("stroke-opacity", 0.4);
  svg.append("text").attr("x", tx).attr("y", ty).attr("text-anchor", "middle").attr("dy", "0.35em").attr("fill", "currentColor").text(m);
});
if (base) {
  const [bx, by] = xy(base.mean_pos, base.r);
  svg.append("line").attr("x2", bx).attr("y2", by).attr("stroke", "#a1a1aa").attr("stroke-dasharray", "4,3").attr("stroke-width", 2)
    .append("title").text(`All fungi: mean ${date(base.mean_pos)}, R = ${base.r.toFixed(2)}. Mostly when people search: the effort the species are corrected for.`);
}
for (const d of rows) {
  const c = colors[d.species] || "currentColor";
  const [x, y] = xy(d.mean_pos, d.r), [cx, cy] = xy(d.corrected_pos, Math.min(1, d.corrected_r));
  const sd = Math.sqrt(-2 * Math.log(d.r)) * 12 / (2 * Math.PI);
  const g = svg.append("g").style("cursor", "pointer").on("click", () => window.open(d.map, "_blank"));
  g.append("line").attr("x2", x).attr("y2", y).attr("stroke", c).attr("stroke-width", 3);
  g.append("circle").attr("cx", x).attr("cy", y).attr("r", 5).attr("fill", c);
  g.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 5).attr("fill", "none").attr("stroke", c).attr("stroke-width", 2);
  g.append("text").attr("x", x).attr("y", y).attr("dx", x >= 0 ? 8 : -8).attr("dy", "0.35em").attr("text-anchor", x >= 0 ? "start" : "end").attr("fill", c).text(d.species);
  g.append("title").text(`${d.species} (${d.latin}): ${d3.format(",")(d.records)} records\nmean date ${date(d.mean_pos)}, R = ${d.r.toFixed(2)} (spread ±${sd.toFixed(1)} months)\neffort-corrected: ${date(d.corrected_pos)}, R = ${d.corrected_r.toFixed(2)}\nclick: GBIF's map of the records`);
}
const wrap = document.createElement("div");
wrap.append(svg.node());
const note = document.createElement("div");
note.style.cssText = "font:11px sans-serif;opacity:.7;max-width:" + W + "px";
note.textContent = "Arrow: mean date (circular mean), length R. Hollow dot: corrected for effort. Grey dashed: all fungi (the effort itself). A mean of months taken as numbers would put a December–January season in June.";
wrap.append(note);
return wrap;