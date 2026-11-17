// Who is flying over Iran now: the aircraft adsb.lol sees within 250 nm of
// north-west and central Iran and of the Gulf (the dashed circles), as
// arrows along their track. Each circle says how many it holds. Hover an
// aircraft for its flight; scroll to zoom, drag to pan.
const W = fit?.width ?? 700, H = fit?.height ?? 520;
const {counts = [], aircraft = []} = data || {};
const CENTRES = [{zone: "Iran north-west (Tehran)", lat: 35.5, lon: 50.5}, {zone: "Iran centre", lat: 32, lon: 54.5}, {zone: "Gulf (comparison)", lat: 26, lon: 53.5}];
const RADIUS_DEG = 250 * 1.852 / 111.2; // 250 nm as an angle
const COL = {plane: "#38bdf8", circle: "#a1a1aa", iran: "#fafafa"};
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const circles = CENTRES.map(c => ({...c, geo: d3.geoCircle().center([c.lon, c.lat]).radius(RADIUS_DEG)(), n: (counts.find(k => k.zone === c.zone) || {}).aircraft}));
const projection = d3.geoMercator().fitExtent([[10, 10], [W - 10, H - 10]], {type: "GeometryCollection", geometries: circles.map(c => c.geo)});
const path = d3.geoPath(projection);

const wrap = d3.create("div").style("position", "relative").style("width", W + "px").style("height", H + "px").style("overflow", "hidden");
const svg = wrap.append("svg").attr("width", W).attr("height", H).style("background", "#0b1220").style("font", "11px sans-serif");
const tip = wrap.append("div").style("position", "absolute").style("pointer-events", "none").style("opacity", 0)
  .style("background", "rgba(9,9,11,.94)").style("color", "#f4f4f5").style("border", "1px solid #3f3f46").style("border-radius", "6px").style("padding", "5px 8px").style("font", "12px sans-serif");
const showTip = (e, html) => { const [x, y] = d3.pointer(e, wrap.node()); tip.html(html).style("opacity", 1).style("left", Math.min(x + 14, W - tip.node().offsetWidth - 4) + "px").style("top", Math.max(0, y - tip.node().offsetHeight - 10) + "px"); };
const hideTip = () => tip.style("opacity", 0);
const world = svg.append("g");

// --- land and borders, Iran outlined
world.append("path").datum(atlas50.land).attr("d", path).attr("fill", "#1f2937");
world.append("path").datum(atlas50.borders).attr("d", path).attr("fill", "none").attr("stroke", "#71717a").attr("stroke-width", 0.6);
const iran = atlas50.countries.features.find(f => f.properties.name === "Iran");
if (iran) world.append("path").datum(iran).attr("d", path).attr("fill", "none").attr("stroke", COL.iran).attr("stroke-width", 1.4);

// --- the three circles, each with its count
for (const c of circles) {
  world.append("path").datum(c.geo).attr("d", path).attr("fill", "none").attr("stroke", COL.circle).attr("stroke-dasharray", "4,3");
  const [x, y] = projection([c.lon, c.lat]);
  world.append("text").attr("x", x).attr("y", y).attr("text-anchor", "middle").attr("fill", c.n ? "#e4e4e7" : "#f87171")
    .attr("stroke", "#0b1220").attr("stroke-width", 3).attr("paint-order", "stroke").style("font", "600 13px sans-serif")
    .text(`${c.n ?? "?"} aircraft`).append("tspan").attr("x", x).attr("dy", 15).style("font", "11px sans-serif").attr("fill", "#a1a1aa").text(c.zone);
}

// --- aircraft
const planes = world.append("g").selectAll("path").data(aircraft.filter(p => !p.on_ground)).join("path")
  .attr("d", "M0,-5 L3.2,4 L0,2 L-3.2,4 Z").attr("transform", p => `translate(${projection([p.lon, p.lat])}) rotate(${p.track ?? 0})`)
  .attr("fill", COL.plane)
  .on("pointermove", (e, p) => showTip(e, `<b>${esc(p.callsign || p.registration || "unknown")}</b> ${esc(p.type || "")}<br>${p.altitude_ft ?? "?"} ft · ${p.speed_kt ?? "?"} kt · track ${Math.round(p.track ?? 0)}°<br>seen at ${esc(p.time)}<br><span style="color:#a1a1aa">adsb.lol (ADS-B, ODbL)</span>`))
  .on("pointerleave", hideTip);

const zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", e => {
  world.attr("transform", e.transform);
  planes.attr("transform", p => `translate(${projection([p.lon, p.lat])}) rotate(${p.track ?? 0}) scale(${1 / e.transform.k})`);
});
svg.call(zoom).on("dblclick.zoom", () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity));
wrap.append("div").style("position", "absolute").style("right", "8px").style("bottom", "6px").style("color", "#a1a1aa").style("font", "10px sans-serif")
  .text("Aircraft: adsb.lol (ODbL) · receivers are sparse in Iran");
return wrap.node();
