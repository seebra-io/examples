// The route on a map of Sweden (FIR ESAA) and its neighbours (atlas50,
// Natural Earth 1:50m): every METAR station coloured by its flight category
// now, the route as a great circle, SMHI's model points on it coloured by
// the worst model category when the aircraft passes, and the SIGMET
// polygons near Sweden. Hover a station for its decoded METAR (wind, gusts,
// visibility, weather, clouds, QNH) and its age; click it for the report at its source.
// Scroll to zoom, drag to pan, double-click to reset.
// Inputs: 0 metars, 1 legs, 2 sigmets, 3 enroute_check; optional 4 the FIR
// polygon(s) and 5 the reporting stations (GeoJSON, SMHI's EDR locations).
// a step with no rows can arrive as something other than an array (an
// empty answer, a SIGMET feed with nothing in force): treat it as no rows
const asRows = x => Array.isArray(x) ? x : (x && Array.isArray(x.rows) ? x.rows : []);
let [mets = [], legs = [], sig = [], en = [], firs = null, stations = null] = Array.isArray(data) ? data : [];
[mets, legs, sig, en] = [mets, legs, sig, en].map(asRows);
const W = fit?.width ?? 640, H = fit?.height ?? 720;
const COL = {VFR: "#16a34a", MVFR: "#2563eb", IFR: "#dc2626", LIFR: "#c026d3"};
const RULE = {VFR: "ceiling > 3000 ft and visibility > 5 SM (8 km)", MVFR: "ceiling 1000–3000 ft or visibility 3–5 SM (5–8 km)",
  IFR: "ceiling 500–999 ft or visibility 1–3 SM (1.6–5 km)", LIFR: "ceiling < 500 ft or visibility < 1 SM (1.6 km)"};
const ago = t => { const m = Math.round((Date.now() / 1000 - t) / 60); return m < 90 ? `${m} min old` : `${(m / 60).toFixed(1)} h old`; };
const z = t => new Date(t * 1000).toISOString().slice(11, 16) + "Z";
const clouds = d => Array.isArray(d.clouds) && d.clouds.length ? d.clouds.map(c => `${c.cover}${c.base != null ? " " + c.base + " ft" : ""}`).join(", ")
  : (String(d.raw).match(/\b(FEW|SCT|BKN|OVC|VV)\d{3}(CB|TCU)?\b|\b(CAVOK|NSC|NCD|SKC|CLR)\b/g) || ["none reported"]).join(" ");
const vis = d => d.vis_m == null ? "?" : String(d.vis).endsWith("+") ? `≥ ${d.vis_m >= 9000 ? "10 km" : Math.round(d.vis_m) + " m"}` : `${Math.round(d.vis_m)} m`;
const wind = d => d.wspd_kt == null ? "?" : d.wspd_kt === 0 ? "calm" : `${d.wdir === "VRB" ? "variable" : String(d.wdir).padStart(3, "0") + "°"} ${d.wspd_kt} kt${d.gust_kt ? `, gusts ${d.gust_kt} kt` : ""}`;

const wrap = d3.create("div").style("position", "relative").style("width", W + "px").style("height", H + "px");
const svg = wrap.append("svg").attr("width", W).attr("height", H).style("font", "11px sans-serif").style("color", "currentColor");
// the hover box is Seebra's one box (seebra.tooltip): beside the pointer, never
// over it, and the only one on screen (another graph's closes when it opens)
const show = (event, html) => seebra.tooltip.show(html, event);
const hide = () => seebra.tooltip.hide();

const projection = d3.geoTransverseMercator().rotate([-16, 0]).fitExtent([[10, 10], [W - 10, H - 40]],
  {type: "MultiPoint", coordinates: [[10.5, 55], [24, 55], [10.5, 69], [24, 69]]});
const path = d3.geoPath(projection);
const g = svg.append("g");
const countries = (typeof atlas50 !== "undefined" ? atlas50 : atlas).countries.features;
g.append("g").selectAll("path").data(countries).join("path").attr("d", path)
  .attr("fill", f => f.properties.name === "Sweden" ? "currentColor" : "none").attr("fill-opacity", 0.06)
  .attr("stroke", "currentColor").attr("stroke-opacity", f => f.properties.name === "Sweden" ? 0.5 : 0.2).attr("stroke-width", 0.7)
  .attr("vector-effect", "non-scaling-stroke")
  .on("pointermove", (ev, f) => show(ev, `<b>${f.properties.name}</b>${f.properties.name === "Sweden" ? "<br>FIR ESAA also covers its waters; the FIR line is not drawn" : ""}`)).on("pointerleave", hide);
g.append("path").attr("d", path(d3.geoGraticule().step([2, 1])())).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.08);

// the FIR (when given): polygons wound either way, drawn as the smaller side
const small = f => { if (d3.geoArea(f) > 2 * Math.PI) f = {...f, geometry: {...f.geometry, coordinates: f.geometry.coordinates.map(r => r.slice().reverse())}}; return f; };
const firF = (firs?.features || []).filter(f => f.geometry?.type === "Polygon").map(small);
g.append("g").selectAll("path").data(firF).join("path").attr("d", path).attr("fill", "none").attr("stroke", "#0ea5e9").attr("stroke-width", 1.5)
  .attr("stroke-dasharray", "6 3").attr("vector-effect", "non-scaling-stroke")
  .on("pointermove", (ev, f) => show(ev, `<b>FIR ${f.id}</b> ${f.properties?.Name ?? ""}: the airspace SIGMETs are issued for`)).on("pointerleave", hide);
// other airports with METARs (when given): where the route could go next
const used = new Set(mets.map(m => m.icao));
const others = (stations?.features || []).filter(f => !used.has(f.id) && f.geometry?.type === "Point");
g.append("g").selectAll("circle").data(others).join("circle").attr("transform", f => `translate(${projection(f.geometry.coordinates)})`).attr("r", 2.5)
  .attr("fill", "currentColor").attr("fill-opacity", 0.35)
  .on("pointermove", (ev, f) => show(ev, `<b>${f.id}</b> ${f.properties?.Name ?? ""}<br>METARs available: add queries for it (copy m_ESSA and t_ESSA, change the ICAO) and name it in the route step`)).on("pointerleave", hide);
// SIGMETs near Sweden: polygons wound either way, drawn as the smaller side
const near = sig.filter(s => s.near && (s.ring || []).length > 2).map(s => {
  let ring = s.ring.slice(); if (ring[0][0] !== ring.at(-1)[0] || ring[0][1] !== ring.at(-1)[1]) ring.push(ring[0]);
  let f = {type: "Feature", properties: s, geometry: {type: "Polygon", coordinates: [ring]}};
  if (d3.geoArea(f) > 2 * Math.PI) f.geometry.coordinates = [ring.slice().reverse()];
  return f;
});
g.append("g").selectAll("path").data(near).join("path").attr("d", path).attr("fill", "#f59e0b").attr("fill-opacity", 0.18)
  .attr("stroke", "#f59e0b").attr("stroke-dasharray", "4 2").attr("vector-effect", "non-scaling-stroke")
  .on("pointermove", (ev, f) => { const s = f.properties; show(ev, `<b>SIGMET ${s.fir} ${s.series ?? ""}</b> ${s.fir_name ?? ""}<br>${s.qualifier ?? ""} ${s.hazard} · ${s.base_ft ?? "SFC"}–${s.top_ft ?? "?"} ft · ${z(s.valid_from)}–${z(s.valid_to)}${s.dir ? ` · moving ${s.dir} ${s.spd_kt ?? ""} kt` : ""}<pre style="margin:4px 0 0;white-space:pre-wrap;font-size:11px">${s.raw}</pre>`); })
  .on("pointerleave", hide);

// the route: a great circle, alternates' offsets as thin lines to it
const dep = legs.find(l => l.role === "departure"), dst = legs.find(l => l.role === "destination");
if (dep?.lon != null && dst?.lon != null) {
  g.append("path").attr("d", path({type: "LineString", coordinates: [[dep.lon, dep.lat], [dst.lon, dst.lat]]}))
    .attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 2.5).attr("stroke-opacity", 0.7).attr("vector-effect", "non-scaling-stroke")
    .on("pointermove", ev => show(ev, `<b>${dep.icao} → ${dst.icao}</b>: ${dep.dist_nm} NM (${dep.dist_km} km), ${dep.flight_h} h at ${dep.cruise_kt} kt<br>ETD ${dep.etd_z}, ETA ${dep.eta_z}`)).on("pointerleave", hide);
  const at = d3.geoInterpolate([dep.lon, dep.lat], [dst.lon, dst.lat]);
  g.append("g").selectAll("path").data(legs.filter(l => l.role === "alternate" && l.lon != null)).join("path")
    .attr("d", l => path({type: "LineString", coordinates: [[l.lon, l.lat], at(Math.max(0, Math.min(1, l.along)))]}))
    .attr("stroke", "currentColor").attr("stroke-opacity", 0.4).attr("stroke-dasharray", "2 3").attr("vector-effect", "non-scaling-stroke");
}
// SMHI model points: squares
g.append("g").selectAll("rect").data(en).join("rect")
  .attr("transform", d => `translate(${projection([d.lon, d.lat])})`).attr("x", -5).attr("y", -5).attr("width", 10).attr("height", 10)
  .attr("fill", d => COL[d.worst]).attr("stroke", "currentColor").attr("stroke-width", 0.8)
  .on("pointermove", (ev, d) => show(ev, `<b>SMHI model, ${d.point} of the route</b> (${d.lat}°N ${d.lon}°E)<br>passing ${d.pass_z}; worst hour ±1 h: <b>${d.worst}</b>, ${d.hours_below} of ${d.hours} h below VMC minima<br>lowest ceiling ${d.min_ceiling_ft ?? "none"} ft · visibility ${d.min_vis_m ?? "?"} m · gusts ${d.max_gust_kt ?? "?"} kt · thunder ${d.max_thunder_pct}%<br><i>a model, not a forecaster's TAF</i>`))
  .on("pointerleave", hide);
// stations: route airports larger and labelled
const R = d => d.role ? 7 : 4.5;
g.append("g").selectAll("circle").data([...mets].sort((a, b) => !!a.role - !!b.role)).join("circle")
  .attr("transform", d => `translate(${projection([d.lon, d.lat])})`).attr("r", R)
  .attr("fill", d => COL[d.category] || "#71717a").attr("stroke", d => d.role ? "currentColor" : "#09090b").attr("stroke-width", d => d.role ? 2 : 0.6)
  .style("cursor", "pointer")
  .on("click", (ev, d) => window.open(d.link, "_blank"))
  .on("pointermove", (ev, d) => show(ev, `<b>${d.icao}</b> ${d.name}${d.role ? ` · <b>${d.role}</b>` : ""}<br>`
    + `<b style="color:${COL[d.category]}">${d.category}</b> (${RULE[d.category]})${d.agrees ? "" : ` · NOAA says ${d.awc_cat}`}<br>`
    + `SERA minima (1500 ft, 5 km): <b>${d.minima}</b><br>`
    + `wind ${wind(d)} · visibility ${vis(d)}${d.wx ? ` · weather ${d.wx}` : ""}<br>clouds ${clouds(d)}${d.ceiling_ft != null ? ` · ceiling ${d.ceiling_ft} ft` : " · no ceiling"}<br>`
    + `QNH ${d.qnh_hpa} hPa · ${d.temp_c}/${d.dew_c} °C · ${d.obs_z} (${ago(d.obs)})<br><code style="font-size:11px">${d.raw}</code><br><i>click: the report at its source</i>`))
  .on("pointerleave", hide);
g.append("g").selectAll("text").data(mets.filter(d => d.role)).join("text")
  .attr("transform", d => `translate(${projection([d.lon, d.lat])})`).attr("dx", 10).attr("dy", 4)
  .attr("fill", "currentColor").style("font-weight", 600).style("paint-order", "stroke").attr("stroke", "var(--background, transparent)").attr("stroke-width", 3)
  .text(d => d.icao);
// legend
const lg = svg.append("g").attr("transform", `translate(12,${H - 24})`);
Object.keys(COL).forEach((k, i) => { const x = i * 70; lg.append("circle").attr("cx", x + 5).attr("cy", 0).attr("r", 5).attr("fill", COL[k]); lg.append("text").attr("x", x + 14).attr("y", 4).attr("fill", "currentColor").text(k).append("title").text(RULE[k]); });
lg.append("rect").attr("x", 285).attr("y", -5).attr("width", 10).attr("height", 10).attr("fill", "none").attr("stroke", "currentColor");
lg.append("text").attr("x", 300).attr("y", 4).attr("fill", "currentColor").text("SMHI model point");
lg.append("rect").attr("x", 405).attr("y", -5).attr("width", 14).attr("height", 10).attr("fill", "#f59e0b").attr("fill-opacity", 0.3).attr("stroke", "#f59e0b");
lg.append("text").attr("x", 424).attr("y", 4).attr("fill", "currentColor").text(`SIGMET (${near.length} near)`);
const zoom = d3.zoom().scaleExtent([1, 12]).on("zoom", e => g.attr("transform", e.transform));
svg.call(zoom).on("dblclick.zoom", () => svg.transition().call(zoom.transform, d3.zoomIdentity));
return wrap.node();
