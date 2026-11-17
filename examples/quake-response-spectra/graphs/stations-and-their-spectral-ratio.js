// The stations around the rupture, coloured by the long/short ratio.
const rows = Array.isArray(data) ? data : [];
const width = fit?.width ?? 640, height = fit?.height ?? 460;
const pts = {type: "MultiPoint", coordinates: rows.map(d => [d.lon, d.lat])};
const projection = d3.geoMercator().fitExtent([[10, 10], [width - 10, height - 30]], pts);
const path = d3.geoPath(projection);
const svg = d3.create("svg").attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");
svg.append("path").attr("d", path(atlas50.land)).attr("fill", "currentColor").attr("fill-opacity", 0.07);
svg.append("path").attr("d", path(atlas50.borders)).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.3);
const color = d3.scaleSequentialLog(d3.interpolatePlasma).domain([0.05, 2]).clamp(true);
for (const d of rows) {
  const [x, y] = projection([d.lon, d.lat]);
  svg.append("a").attr("href", "https://earthquake.usgs.gov/earthquakes/eventpage/ci38457511/shakemap/stations").attr("target", "_blank")
    .append("circle").attr("cx", x).attr("cy", y).attr("r", 3.2).attr("fill", color(d.long_short)).attr("stroke", "currentColor").attr("stroke-opacity", 0.3)
    .append("title").text(`${d.name} (${d.station})\n${d.distance_km} km from the rupture\nPGA ${d.pga} %g · SA(0.3 s) ${d.psa03} · SA(1 s) ${d.psa10} · SA(3 s) ${d.psa30} %g\nSA(3 s)/SA(0.3 s) = ${d.long_short}`);
}
const [ex, ey] = projection([-117.599, 35.770]);
svg.append("path").attr("d", d3.symbol(d3.symbolStar, 220)()).attr("transform", `translate(${ex},${ey})`).attr("fill", "#dc2626").append("title").text("Epicentre, M7.1 Ridgecrest, 6 July 2019 03:19 UTC");
const lg = svg.append("g").attr("transform", `translate(12, ${height - 18})`);
[0.05, 0.1, 0.2, 0.5, 1, 2].forEach((v, i) => { lg.append("rect").attr("x", i * 36).attr("width", 36).attr("height", 8).attr("fill", color(v)); lg.append("text").attr("x", i * 36).attr("y", -3).attr("fill", "currentColor").text(v); });
lg.append("text").attr("x", 230).attr("y", 8).attr("fill", "currentColor").text("SA(3 s)/SA(0.3 s)");
return svg.node();