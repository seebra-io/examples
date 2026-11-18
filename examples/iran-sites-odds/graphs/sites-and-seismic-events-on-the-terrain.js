// Iran and the Gulf on their terrain (GMRT elevation, hillshaded and tinted
// by height) with the sites the dashboard follows (from Wikipedia; click
// for the article) and USGS's seismic events of the last 30 days (size:
// magnitude; colour: depth, shallow is orange). Air traffic is its own map
// (Airspace now). Hover for the record; the legend turns layers on and
// off; scroll to zoom, drag to pan, double-click to reset.
// Inputs: 0 terrain, 1 sites, 2 quakes.
const W = fit?.width ?? 900, H = fit?.height ?? 640;
const [grid = {}, sites = [], quakes = []] = Array.isArray(data) ? data : [];
const BOX = {w: 43.5, e: 63.5, s: 24.5, n: 40};
const COL = {nuclear: "#facc15", military: "#f97316", other: "#e4e4e7", shallow: "#f97316", deep: "#a78bfa", plane: "#38bdf8"};
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));

// --- Mercator: the grid's lon/lat box stays a rectangle; scaled so the
// terrain covers the whole frame (centred on it), or to Iran without terrain
const projection = d3.geoMercator();
if (grid.z) {
  const gw = grid.west, ge = grid.west + grid.cols * grid.cell, gn = grid.north, gs = grid.north - grid.rows * grid.cell;
  projection.scale(1).translate([0, 0]);
  const [x0, y0] = projection([gw, gn]), [x1, y1] = projection([ge, gs]);
  const k = Math.max(W / (x1 - x0), H / (y1 - y0)) * 1.001;
  projection.scale(k).translate([W / 2 - k * (x0 + x1) / 2, H / 2 - k * (y0 + y1) / 2]);
} else projection.fitExtent([[0, 0], [W, H]], {type: "MultiPoint", coordinates: [[BOX.w, BOX.s], [BOX.e, BOX.n]]});
const path = d3.geoPath(projection);

// --- frame, tooltip
const wrap = d3.create("div").style("position", "relative").style("width", W + "px").style("height", H + "px").style("overflow", "hidden");
const svg = wrap.append("svg").attr("width", W).attr("height", H).style("font", "11px sans-serif").style("background", "#0b1220");
// the hover box is Seebra's one box (seebra.tooltip): beside the pointer, never
// over it, and the only one on screen (another graph's closes when it opens)
const showTip = (event, html) => seebra.tooltip.show(html, event);
const hideTip = () => seebra.tooltip.hide();
const world = svg.append("g");

// --- terrain: each pixel looks up the grid through the projection, shaded
// from the north-west (hillshade, heights exaggerated 3x)
if (grid.z) {
  const {cols, rows, west, north, cell, z} = grid;
  const at = (c, r) => z[Math.max(0, Math.min(rows - 1, r)) * cols + Math.max(0, Math.min(cols - 1, c))] ?? 0;
  const shade = new Float32Array(cols * rows);
  const EXAG = 3, AZ = 315 * Math.PI / 180, ALT = 45 * Math.PI / 180;
  for (let r = 0; r < rows; r++) {
    const lat = north - (r + 0.5) * cell, dx = cell * 111320 * Math.cos(lat * Math.PI / 180), dy = cell * 110570;
    for (let c = 0; c < cols; c++) {
      const gx = (at(c + 1, r) - at(c - 1, r)) / (2 * dx) * EXAG, gy = (at(c, r - 1) - at(c, r + 1)) / (2 * dy) * EXAG;
      const slope = Math.atan(Math.hypot(gx, gy)), aspect = Math.atan2(gy, -gx);
      shade[r * cols + c] = Math.max(0, Math.cos(ALT) * Math.cos(slope) + Math.sin(ALT) * Math.sin(slope) * Math.cos(AZ - Math.PI / 2 - aspect));
    }
  }
  const land = d3.scaleLinear().domain([-30, 0, 300, 1000, 1800, 2800, 4000]).range(["#6b7f4a", "#8f8a5a", "#b49a6a", "#a7825a", "#8c6b4a", "#a89a8c", "#f5f5f4"]).clamp(true);
  const sea = d3.scaleLinear().domain([-3000, -100, 0]).range(["#0c1f3d", "#1e3a5f", "#2f6a8a"]).clamp(true);
  const S = 2;
  const canvas = document.createElement("canvas"); canvas.width = W * S; canvas.height = H * S;
  const ctx = canvas.getContext("2d"), img = ctx.createImageData(canvas.width, canvas.height);
  for (let py = 0; py < canvas.height; py++) for (let px = 0; px < canvas.width; px++) {
    const ll = projection.invert([px / S, py / S]); if (!ll) continue;
    const c = Math.floor((ll[0] - west) / cell), r = Math.floor((north - ll[1]) / cell);
    if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
    const h = z[r * cols + c]; if (h == null) continue;
    // the Caspian lies below sea level (about -28 m): land tints there, water by shape is beyond this grid
    const water = h < -30, k = water ? 1 : 0.35 + 0.85 * shade[r * cols + c], rgb = d3.rgb(water ? sea(h) : land(h)), i = (py * canvas.width + px) * 4;
    img.data[i] = Math.min(255, rgb.r * k); img.data[i + 1] = Math.min(255, rgb.g * k); img.data[i + 2] = Math.min(255, rgb.b * k); img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  world.append("image").attr("href", canvas.toDataURL("image/png")).attr("width", W).attr("height", H)
    .on("pointermove", e => { const ll = projection.invert(d3.pointer(e, world.node())); const c = Math.floor((ll[0] - west) / cell), r = Math.floor((north - ll[1]) / cell);
      const h = z[r * cols + c]; showTip(e, `${ll[1].toFixed(2)}°N ${ll[0].toFixed(2)}°E · ${h == null ? "no data" : (h < 0 ? (-h) + " m below sea level" : h + " m above sea level")}<br><span style="color:#a1a1aa">${esc(grid.source)}</span>`); })
    .on("pointerleave", hideTip);
}

// --- borders and names (Natural Earth 1:50m), Iran outlined
const iran = atlas50.countries.features.find(f => f.properties.name === "Iran");
world.append("path").datum(atlas50.borders).attr("d", path).attr("fill", "none").attr("stroke", "#e4e4e7").attr("stroke-width", 0.8).attr("stroke-opacity", 0.7).attr("pointer-events", "none");
if (iran) world.append("path").datum(iran).attr("d", path).attr("fill", "none").attr("stroke", "#fafafa").attr("stroke-width", 1.6).attr("pointer-events", "none");
world.append("g").selectAll("text").data(atlas50.countries.features.filter(f => ["Iran", "Iraq", "Saudi Arabia", "Afghanistan", "Pakistan", "Turkmenistan", "Turkey", "Oman", "United Arab Emirates", "Kuwait", "Qatar", "Azerbaijan"].includes(f.properties.name)))
  .join("text").attr("transform", f => { const c = projection(d3.geoCentroid(f)); return c && c[0] > 20 && c[0] < W - 20 && c[1] > 20 && c[1] < H - 20 ? `translate(${c})` : "translate(-999,-999)"; })
  .attr("text-anchor", "middle").attr("fill", "#f4f4f5").attr("fill-opacity", 0.5).style("font", "600 13px sans-serif").attr("pointer-events", "none").text(f => f.properties.name);

const layer = name => world.append("g").attr("data-layer", name);
// --- seismic events
const gQ = layer("seismic events");
const r = d3.scaleSqrt().domain([2.5, 7]).range([3, 13]);
gQ.selectAll("circle").data(quakes).join("circle").attr("cx", q => projection([q.lon, q.lat])[0]).attr("cy", q => projection([q.lon, q.lat])[1])
  .attr("r", q => r(q.mag)).attr("fill", q => q.depth_km < 15 ? COL.shallow : COL.deep).attr("fill-opacity", 0.55).attr("stroke", "#09090b").attr("stroke-width", 0.8)
  .style("cursor", "pointer")
  .on("pointermove", (e, q) => showTip(e, `<b>M${q.mag} ${esc(q.type)}</b> · ${esc(q.time)} UTC<br>${esc(q.place)} · ${q.depth_km} km deep<br>${q.km_to_site} km from ${esc(q.nearest_site)}<br><span style="color:#a1a1aa">click: the USGS event page</span>`))
  .on("pointerleave", hideTip).on("click", (e, q) => window.open(q.url, "_blank"));
// --- followed sites
const gS = layer("sites");
const sc = s => /nuclear/.test(s.kind) ? COL.nuclear : s.kind === "military" ? COL.military : COL.other;
const site = gS.selectAll("g").data(sites).join("g").attr("transform", s => `translate(${projection([s.lon, s.lat])})`).style("cursor", "pointer")
  .on("pointermove", (e, s) => showTip(e, `<b>${esc(s.name)}</b> · ${esc(s.kind)}<br>${esc(s.description)}<br>${s.lat.toFixed(3)}°N ${s.lon.toFixed(3)}°E<br><span style="color:#a1a1aa">click: its Wikipedia article (the coordinates' source)</span>`))
  .on("pointerleave", hideTip).on("click", (e, s) => window.open(s.url, "_blank"));
site.append("path").attr("d", d3.symbol(d3.symbolDiamond, 70)).attr("fill", sc).attr("stroke", "#18181b").attr("stroke-width", 1);
site.append("text").attr("x", 7).attr("dy", 4).attr("fill", "#fafafa").attr("stroke", "#09090b").attr("stroke-width", 3).attr("paint-order", "stroke")
  .style("font", "600 11px sans-serif").text(s => s.name.replace(/ (Nuclear Facility|Uranium Enrichment Plant|Nuclear Power Plant)$/, ""));

// --- legend: click a row to hide or show its layer
const legend = wrap.append("div").style("position", "absolute").style("left", "8px").style("top", "8px").style("background", "rgba(9,9,11,.82)")
  .style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "6px 8px").style("color", "#e4e4e7").style("font", "11px sans-serif");
legend.append("div").style("font-weight", "600").style("margin-bottom", "3px").text(`${sites.length} sites · ${quakes.length} seismic events (30 days)`);
for (const [key, label, color] of [["sites", "nuclear / military / other sites", COL.nuclear], ["seismic events", "seismic events M2.5+ (orange: < 15 km deep)", COL.shallow]]) {
  const row = legend.append("div").style("display", "flex").style("align-items", "center").style("gap", "6px").style("cursor", "pointer").style("user-select", "none");
  row.append("span").style("width", "10px").style("height", "10px").style("border-radius", "2px").style("background", color);
  row.append("span").text(label);
  row.on("click", () => { const g = world.select(`[data-layer="${key}"]`); const off = g.style("display") === "none"; g.style("display", off ? null : "none"); row.style("opacity", off ? 1 : 0.4); });
}

// --- zoom and pan; marks keep their size
const zoom = d3.zoom().scaleExtent([1, 14]).translateExtent([[0, 0], [W, H]]).on("zoom", e => {
  const k = e.transform.k;
  world.attr("transform", e.transform);
  site.attr("transform", s => `translate(${projection([s.lon, s.lat])}) scale(${1 / k})`);
  gQ.selectAll("circle").attr("r", q => r(q.mag) / Math.sqrt(k)).attr("stroke-width", 0.8 / k);
});
svg.call(zoom).on("dblclick.zoom", () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity));
wrap.append("div").style("position", "absolute").style("right", "8px").style("bottom", "6px").style("color", "#a1a1aa").style("font", "10px sans-serif")
  .text("Terrain: GMRT (CC BY 4.0) · sites: Wikipedia · seismic: USGS · borders: Natural Earth");
return wrap.node();
