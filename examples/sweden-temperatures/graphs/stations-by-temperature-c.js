// A map (D3): one dot per station, coloured by temperature, on a transverse
// Mercator centred on Sweden. Scroll to zoom, double-click to reset.
// data: stations {station, temp °C, time, quality, lat, lon, height_m, owner, key}
const W = fit?.width ?? 520, H = fit?.height ?? 640;
const stations = (Array.isArray(data) ? data : []).filter(d => Number.isFinite(d.temp) && Number.isFinite(d.lat));
const checked = d => d.quality === "G";

// --- frame: an SVG with a hover tip in a positioned div
const wrap = d3.create("div").style("position", "relative").style("width", W + "px").style("height", H + "px");
const svg = wrap.append("svg").attr("width", W).attr("height", H).style("font", "11px sans-serif").style("color", "currentColor");
const tip = wrap.append("div").style("position", "absolute").style("pointer-events", "none").style("opacity", 0)
  .style("background", "rgba(9,9,11,.94)").style("color", "#f4f4f5").style("border", "1px solid #3f3f46")
  .style("border-radius", "6px").style("padding", "4px 8px").style("font", "12px sans-serif").style("white-space", "nowrap");
const showTip = (event, html) => {
  const [px, py] = d3.pointer(event, wrap.node());
  tip.html(html).style("opacity", 1);
  const w = tip.node().offsetWidth, h = tip.node().offsetHeight;
  tip.style("left", Math.max(0, Math.min(px + 14, W - w - 2)) + "px").style("top", Math.max(0, py - h - 10 < 0 ? py + 14 : py - h - 10) + "px");
};
const hideTip = () => tip.style("opacity", 0);

// --- scales: the projection (lon/lat to pixels) and the temperature colour
const legendWidth = 70;
const projection = d3.geoTransverseMercator().rotate([-15, 0])
  .fitExtent([[10, 24], [W - legendWidth - 10, H - 10]], {type: "MultiPoint", coordinates: stations.map(d => [d.lon, d.lat])});
const path = d3.geoPath(projection);
const limit = Math.max(1, d3.max(stations, d => Math.abs(d.temp)) || 1); // symmetric around 0 °C
const tempColor = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t)).domain([-limit, 0, limit]);

// --- the map: Sweden and its neighbours (atlas50: Natural Earth 1:50m,
// shipped with Seebra), the graticule, then the stations (mildest first, so
// the extremes are on top)
const world = svg.append("g");
world.append("g").selectAll("path").data(atlas50.countries.features).join("path")
  .attr("d", path)
  .attr("fill", f => f.properties.name === "Sweden" ? "currentColor" : "none")
  .attr("fill-opacity", 0.06)
  .attr("stroke", "currentColor").attr("stroke-opacity", f => f.properties.name === "Sweden" ? 0.45 : 0.2)
  .attr("stroke-width", 0.7).attr("vector-effect", "non-scaling-stroke")
  .append("title").text(f => f.properties.name);
world.append("path").attr("d", path(d3.geoGraticule().step([2, 1])())).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.12);
const rank = d => stations.filter(o => o.temp > d.temp).length + 1;
const dots = world.append("g").selectAll("circle")
  .data([...stations].sort((a, b) => Math.abs(a.temp) - Math.abs(b.temp)))
  .join("circle")
  .attr("transform", d => `translate(${projection([d.lon, d.lat])})`)
  .attr("r", 5)
  .attr("fill", d => tempColor(d.temp))
  .attr("stroke", d => checked(d) ? "#09090b" : "#facc15")
  .style("cursor", "pointer")
  .on("pointerenter", function () { d3.select(this).attr("stroke", "#fff").raise(); })
  .on("pointermove", (event, d) => showTip(event,
    `<b>${d.station}</b> · ${d.temp} °C<br>#${rank(d)} warmest of ${stations.length}<br>` +
    `${d.height_m} m above sea · ${d.lat.toFixed(2)}°N ${d.lon.toFixed(2)}°E<br>` +
    `${d.time.slice(11, 16)} UTC · quality ${checked(d) ? "checked" : "suspect or unchecked"}<br><span style="color:#a1a1aa">${d.owner}</span>`))
  .on("pointerleave", function (event, d) { d3.select(this).attr("stroke", checked(d) ? "#09090b" : "#facc15"); hideTip(); });

// --- labels on the warmest and the coldest station
const labels = world.append("g").style("pointer-events", "none");
for (const d of [d3.greatest(stations, d => d.temp), d3.least(stations, d => d.temp)].filter(Boolean)) {
  const [px, py] = projection([d.lon, d.lat]);
  labels.append("text").attr("x", px + 8).attr("y", py).attr("dy", "0.35em").attr("fill", "currentColor")
    .attr("paint-order", "stroke").attr("stroke", "#09090b").attr("stroke-width", 3).text(`${d.station} ${d.temp}°`);
}

// --- zoom: dots keep a readable size
const zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", e => { world.attr("transform", e.transform); dots.attr("r", 5 / Math.sqrt(e.transform.k)); });
svg.call(zoom).on("dblclick.zoom", () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity));

// --- colour legend (°C) and a summary line
const legendHeight = Math.min(220, H - 60);
const legendY = d3.scaleLinear().domain([-limit, limit]).range([legendHeight, 0]);
const legend = svg.append("g").attr("transform", `translate(${W - legendWidth + 10},30)`);
const gradient = svg.append("defs").append("linearGradient").attr("id", "smhi-temp").attr("x1", 0).attr("x2", 0).attr("y1", 1).attr("y2", 0);
d3.range(0, 1.01, 0.1).forEach(t => gradient.append("stop").attr("offset", t).attr("stop-color", tempColor(-limit + 2 * limit * t)));
legend.append("rect").attr("width", 10).attr("height", legendHeight).attr("fill", "url(#smhi-temp)");
legend.append("g").attr("transform", "translate(10,0)").call(d3.axisRight(legendY).ticks(6));
legend.append("text").attr("y", -8).attr("fill", "currentColor").text("°C");
svg.append("text").attr("x", 10).attr("y", 14).attr("fill", "currentColor").attr("fill-opacity", 0.6)
  .text(`${stations.length} stations · mean ${d3.format(".1f")(d3.mean(stations, d => d.temp))} °C · yellow ring: unchecked · scroll to zoom`);
return wrap.node();