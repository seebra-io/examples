// Ukraine on its terrain (GMRT elevation, hillshaded and tinted by height)
// with DeepStateMap's areas of control now, the line of 1 January 2026
// (dashed) to compare, its attack directions, the Russian units and
// airfields it places, and the last 120 days of its located updates as dots
// (red: Russian advance, blue: Ukrainian; brighter is newer). Hover for
// the record, click a dot for that place on DeepStateMap. The legend turns
// layers on and off; scroll to zoom, drag to pan, double-click to reset.
// Inputs: 0 terrain, 1 front_now, 2 front_base, 3 events, 4 area.
const W = fit?.width ?? 900, H = fit?.height ?? 620;
const [grid = {}, now = {}, base = {}, events = [], area = []] = Array.isArray(data) ? data : [];
const BOX = {w: 22, e: 40.5, s: 44, n: 52.5};
const COL = {
  occupied: "#dc2626", "occupied since 2014": "#7f1d1d", "status unknown": "#a1a1aa", liberated: "#16a34a",
  baseline: "#fde047", attack: "#f97316", unit: "#fca5a5", airfield: "#e4e4e7",
  "Russian advance": "#ef4444", "Ukrainian advance": "#3b82f6", other: "#d4d4d8",
};
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));

// --- projection: conformal conic for Ukraine, fitted to the box
const boxGeo = {type: "Polygon", coordinates: [[[BOX.w, BOX.s], [BOX.w, BOX.n], [BOX.e, BOX.n], [BOX.e, BOX.s], [BOX.w, BOX.s]]]};
const projection = d3.geoConicConformal().parallels([45, 52]).rotate([-31, 0]).fitSize([W, H], boxGeo);
const path = d3.geoPath(projection);
// d3 wants polygons wound clockwise; GeoJSON's are the other way round
const rewind = g => {
  const fix = rings => d3.geoArea({type: "Polygon", coordinates: rings}) > 2 * Math.PI ? rings.map(r => r.slice().reverse()) : rings;
  return g.type === "Polygon" ? {type: "Polygon", coordinates: fix(g.coordinates)} : {type: "MultiPolygon", coordinates: g.coordinates.map(fix)};
};

// --- frame, tooltip
const wrap = d3.create("div").style("position", "relative").style("width", W + "px").style("height", H + "px").style("overflow", "hidden");
const svg = wrap.append("svg").attr("width", W).attr("height", H).style("font", "11px sans-serif").style("background", "#0b1220");
const tip = wrap.append("div").style("position", "absolute").style("pointer-events", "none").style("opacity", 0).style("max-width", "320px")
  .style("background", "rgba(9,9,11,.94)").style("color", "#f4f4f5").style("border", "1px solid #3f3f46")
  .style("border-radius", "6px").style("padding", "5px 8px").style("font", "12px sans-serif").style("z-index", 2);
const showTip = (event, html) => {
  const [x, y] = d3.pointer(event, wrap.node());
  tip.html(html).style("opacity", 1);
  const tw = tip.node().offsetWidth, th = tip.node().offsetHeight;
  tip.style("left", Math.min(x + 14, W - tw - 4) + "px").style("top", (y - th - 12 < 0 ? y + 16 : y - th - 12) + "px");
};
const hideTip = () => tip.style("opacity", 0);
const world = svg.append("g");

// --- terrain: each pixel looks up the grid through the projection, shaded
// from the north-west (hillshade, heights exaggerated 8x so the plains show)
if (grid.z) {
  const {cols, rows, west, north, cell, z} = grid;
  const at = (c, r) => z[Math.max(0, Math.min(rows - 1, r)) * cols + Math.max(0, Math.min(cols - 1, c))] ?? 0;
  const shade = new Float32Array(cols * rows);
  const EXAG = 8, AZ = 315 * Math.PI / 180, ALT = 45 * Math.PI / 180;
  for (let r = 0; r < rows; r++) {
    const lat = north - (r + 0.5) * cell, dx = cell * 111320 * Math.cos(lat * Math.PI / 180), dy = cell * 110570;
    for (let c = 0; c < cols; c++) {
      const gx = (at(c + 1, r) - at(c - 1, r)) / (2 * dx) * EXAG, gy = (at(c, r - 1) - at(c, r + 1)) / (2 * dy) * EXAG;
      const slope = Math.atan(Math.hypot(gx, gy)), aspect = Math.atan2(gy, -gx);
      shade[r * cols + c] = Math.max(0, Math.cos(ALT) * Math.cos(slope) + Math.sin(ALT) * Math.sin(slope) * Math.cos(AZ - Math.PI / 2 - aspect));
    }
  }
  const land = d3.scaleLinear().domain([0, 150, 400, 1000, 2000, 3500]).range(["#3f6b3a", "#5b7f43", "#8a8a52", "#8c6b45", "#a58a72", "#e7e5e4"]).clamp(true);
  const sea = d3.scaleLinear().domain([-2500, -200, 0]).range(["#0c1f3d", "#1e3a5f", "#2b5277"]).clamp(true);
  const S = 2; // canvas pixels per screen pixel, so a 2x zoom stays sharp
  const canvas = document.createElement("canvas"); canvas.width = W * S; canvas.height = H * S;
  const ctx = canvas.getContext("2d"), img = ctx.createImageData(canvas.width, canvas.height);
  for (let py = 0; py < canvas.height; py++) for (let px = 0; px < canvas.width; px++) {
    const ll = projection.invert([px / S, py / S]); if (!ll) continue;
    const c = Math.floor((ll[0] - west) / cell), r = Math.floor((north - ll[1]) / cell);
    if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
    const h = z[r * cols + c]; if (h == null) continue;
    const k = 0.35 + 0.85 * shade[r * cols + c], rgb = d3.rgb(h < 0 ? sea(h) : land(h)), i = (py * canvas.width + px) * 4;
    img.data[i] = Math.min(255, rgb.r * (h < 0 ? 1 : k)); img.data[i + 1] = Math.min(255, rgb.g * (h < 0 ? 1 : k)); img.data[i + 2] = Math.min(255, rgb.b * (h < 0 ? 1 : k)); img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  world.append("image").attr("href", canvas.toDataURL("image/png")).attr("width", W).attr("height", H)
    .on("pointermove", e => { const ll = projection.invert(d3.pointer(e, world.node())); const c = Math.floor((ll[0] - west) / cell), r = Math.floor((north - ll[1]) / cell);
      const h = z[r * cols + c]; showTip(e, `${ll[1].toFixed(2)}°N ${ll[0].toFixed(2)}°E · ${h == null ? "no data" : (h < 0 ? "sea floor " + (-h) + " m deep" : h + " m above sea level")}<br><span style="color:#a1a1aa">${esc(grid.source)}</span>`); })
    .on("pointerleave", hideTip);
}

// --- borders (Natural Earth 1:50m)
world.append("path").datum(atlas50.borders).attr("d", path).attr("fill", "none").attr("stroke", "#e4e4e7").attr("stroke-width", 0.8).attr("stroke-opacity", 0.7).attr("pointer-events", "none");
world.append("g").selectAll("text").data(atlas50.countries.features.filter(f => ["Ukraine", "Russia", "Belarus", "Poland", "Romania", "Moldova", "Hungary", "Slovakia", "Turkey"].includes(f.properties.name)))
  .join("text").attr("transform", f => { const c = projection(d3.geoCentroid(f)); return c && c[0] > 0 && c[0] < W && c[1] > 0 && c[1] < H ? `translate(${c})` : "translate(-999,-999)"; })
  .attr("text-anchor", "middle").attr("fill", "#f4f4f5").attr("fill-opacity", 0.45).style("font", "600 13px sans-serif").attr("pointer-events", "none").text(f => f.properties.name);

// --- layers, each a group the legend can hide
const layer = name => world.append("g").attr("data-layer", name);
const areaRows = s => (now.areas || []).filter(a => a.status === s);
const areaInfo = Object.fromEntries((area || []).map(a => [a.status, a]));
const fmt = n => n == null ? "?" : Math.round(n).toLocaleString();
for (const s of ["liberated", "status unknown", "occupied since 2014", "occupied"]) {
  const g = layer(s);
  g.selectAll("path").data(areaRows(s)).join("path").attr("d", a => path(rewind(a.geometry)))
    .attr("fill", COL[s]).attr("fill-opacity", s === "liberated" ? 0.18 : s === "status unknown" ? 0.5 : 0.5)
    .attr("stroke", COL[s]).attr("stroke-width", 0.6)
    .on("pointermove", (e, a) => { const i = areaInfo[s]; showTip(e, `<b>${esc(s)}</b>${a.name && a.name.toLowerCase() !== s ? " · " + esc(a.name) : ""}<br>` +
      (i ? `all ${esc(s)}: ${fmt(i.km2_now)} km² now, ${i.change_km2 >= 0 ? "+" : ""}${fmt(i.change_km2)} km² since ${esc(i.baseline)}<br>` : "") +
      `<span style="color:#a1a1aa">DeepStateMap, ${esc(now.snapshot)}</span>`); })
    .on("pointerleave", hideTip);
}
const gBase = layer("1 January line");
gBase.selectAll("path").data((base.areas || []).filter(a => a.status === "occupied")).join("path").attr("d", a => path(rewind(a.geometry)))
  .attr("fill", "none").attr("stroke", COL.baseline).attr("stroke-width", 1).attr("stroke-dasharray", "3,2").attr("pointer-events", "none");
const gAir = layer("airfields");
gAir.selectAll("path").data(now.airfields || []).join("path").attr("d", d3.symbol(d3.symbolDiamond, 40)).attr("transform", d => `translate(${projection([d.lon, d.lat])})`)
  .attr("fill", COL.airfield).attr("stroke", "#18181b").attr("stroke-width", 0.6)
  .on("pointermove", (e, d) => showTip(e, `<b>${esc(d.name)}</b>${d.note ? "<br>" + esc(d.note) : ""}<br><span style="color:#a1a1aa">military airfield, as DeepStateMap marks it</span>`)).on("pointerleave", hideTip);
const gUnits = layer("units");
gUnits.selectAll("rect").data(now.units || []).join("rect").attr("x", d => projection([d.lon, d.lat])[0] - 2.5).attr("y", d => projection([d.lon, d.lat])[1] - 2.5)
  .attr("width", 5).attr("height", 5).attr("fill", COL.unit).attr("stroke", "#450a0a").attr("stroke-width", 0.6)
  .on("pointermove", (e, d) => showTip(e, `<b>${esc(d.name)}</b> (${esc(d.kind)})${d.note ? "<br>" + esc(d.note) : ""}<br><span style="color:#a1a1aa">where DeepStateMap last placed it; not verified here</span>`)).on("pointerleave", hideTip);
const gAtk = layer("attack directions");
gAtk.selectAll("path").data(now.attacks || []).join("path").attr("d", d3.symbol(d3.symbolTriangle, 46)).attr("transform", d => `translate(${projection([d.lon, d.lat])})`)
  .attr("fill", COL.attack).attr("stroke", "#431407").attr("stroke-width", 0.6)
  .on("pointermove", e => showTip(e, `<b>Direction of attack</b><br><span style="color:#a1a1aa">DeepStateMap's marker (it shows where, not which way here)</span>`)).on("pointerleave", hideTip);
const gEv = layer("updates");
const newest = d3.max(events, d => Date.parse(d.time.replace(" ", "T") + "Z")) || Date.now();
const age = d => (newest - Date.parse(d.time.replace(" ", "T") + "Z")) / 86400000;
gEv.selectAll("circle").data(events.slice().reverse()).join("circle").attr("cx", d => projection([d.lon, d.lat])[0]).attr("cy", d => projection([d.lon, d.lat])[1])
  .attr("r", d => age(d) < 7 ? 5 : 3.5).attr("fill", d => COL[d.side]).attr("fill-opacity", d => Math.max(0.25, 1 - age(d) / 120)).attr("stroke", "#09090b").attr("stroke-width", 0.8)
  .style("cursor", "pointer")
  .on("pointermove", (e, d) => showTip(e, `<b>${esc(d.place)}</b> · ${esc(d.side)}<br>${esc(d.time)} UTC (${Math.round(age(d))} days before the newest)<br>${esc(d.text)}<br><span style="color:#a1a1aa">click: this place on DeepStateMap</span>`))
  .on("pointerleave", hideTip).on("click", (e, d) => window.open(d.url, "_blank"));

// --- legend: click a row to hide or show its layer
const occ = areaInfo["occupied"] || {};
const legend = wrap.append("div").style("position", "absolute").style("left", "8px").style("top", "8px").style("background", "rgba(9,9,11,.82)")
  .style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "6px 8px").style("color", "#e4e4e7").style("font", "11px sans-serif");
legend.append("div").style("font-weight", "600").style("margin-bottom", "3px").text(`DeepStateMap ${now.snapshot ?? ""}`);
legend.append("div").style("color", "#a1a1aa").style("margin-bottom", "4px")
  .html(`occupied since 2022: ${fmt(occ.km2_now)} km² (${occ.change_km2 >= 0 ? "+" : ""}${fmt(occ.change_km2)} since 1 Jan)`);
const rows = [["occupied", "occupied (since 2022)"], ["occupied since 2014", "occupied since 2014"], ["status unknown", "status unknown (grey zone)"], ["liberated", "liberated"],
  ["1 January line", "occupied on 1 January (dashed)", COL.baseline], ["updates", "updates: Russian / Ukrainian advance", COL["Russian advance"]],
  ["attack directions", "attack directions", COL.attack], ["units", "units placed by DeepState", COL.unit], ["airfields", "military airfields", COL.airfield]];
for (const [key, label, color] of rows) {
  const row = legend.append("div").style("display", "flex").style("align-items", "center").style("gap", "6px").style("cursor", "pointer").style("user-select", "none");
  row.append("span").style("width", "10px").style("height", "10px").style("border-radius", "2px").style("background", color || COL[key]);
  row.append("span").text(label);
  row.on("click", () => { const g = world.select(`[data-layer="${key}"]`); const off = g.style("display") === "none"; g.style("display", off ? null : "none"); row.style("opacity", off ? 1 : 0.4); });
}

// --- zoom and pan; marks keep their size
const zoom = d3.zoom().scaleExtent([1, 14]).translateExtent([[0, 0], [W, H]]).on("zoom", e => {
  world.attr("transform", e.transform);
  const k = e.transform.k;
  world.selectAll("[data-layer] path, [data-layer] rect, [data-layer] circle").attr("stroke-width", function () { return (this.__sw ??= +this.getAttribute("stroke-width") || 0.6) / k; });
  gEv.selectAll("circle").attr("r", d => (age(d) < 7 ? 5 : 3.5) / Math.sqrt(k));
  gUnits.selectAll("rect").attr("transform", d => { const [x, y] = projection([d.lon, d.lat]); return `translate(${x},${y}) scale(${1 / Math.sqrt(k)}) translate(${-x},${-y})`; });
  gAir.selectAll("path").attr("transform", d => `translate(${projection([d.lon, d.lat])}) scale(${1 / Math.sqrt(k)})`);
  gAtk.selectAll("path").attr("transform", d => `translate(${projection([d.lon, d.lat])}) scale(${1 / Math.sqrt(k)})`);
});
svg.call(zoom).on("dblclick.zoom", () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity));
wrap.append("div").style("position", "absolute").style("right", "8px").style("bottom", "6px").style("color", "#a1a1aa").style("font", "10px sans-serif")
  .text("Terrain: GMRT (CC BY 4.0) · control: DeepStateMap.Live · borders: Natural Earth");
return wrap.node();
