// Where the ionosondes are and what they see now: foF2 on the map, day and night from local solar time.
const rows = Array.isArray(data) ? data : [];
const width = fit?.width ?? 720, height = fit?.height ?? 380;
const projection = d3.geoNaturalEarth1().fitSize([width, height], {type: "Sphere"});
const path = d3.geoPath(projection);
const svg = d3.create("svg").attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");
svg.append("path").attr("d", path({type: "Sphere"})).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.2);
svg.append("path").attr("d", path(atlas.land)).attr("fill", "currentColor").attr("fill-opacity", 0.08);
svg.append("path").attr("d", path(atlas.borders)).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.2);
const color = d3.scaleSequential(d3.interpolateTurbo).domain([1, 12]);
const r = d3.scaleSqrt().domain([0, 40]).range([2, 12]);
const g = svg.append("g");
for (const d of rows) {
  const [x, y] = projection([d.lon, d.lat]);
  const a = g.append("a").attr("href", "https://prop.kc2g.com/stations/").attr("target", "_blank");
  a.append("circle").attr("cx", x).attr("cy", y).attr("r", r(d.mufd ?? 0)).attr("fill", color(d.fof2)).attr("stroke", d.daylight === "night" ? "#1e3a8a" : "#78350f").attr("stroke-width", 1.5).attr("fill-opacity", 0.85)
    .append("title").text(`${d.name} (${d.code})\nlocal solar time ${d.lst} h (${d.daylight})\nfoF2 ${d.fof2} MHz · hmF2 ${d.hmf2 ?? "?"} km\nM(3000)F2 ${d.m3000} · MUF(3000) ${d.mufd} MHz\npeak density ${d.nmax_e11_m3}×10¹¹ e/m³\nmeasured ${d.time} UTC (${d.age_min} min before the newest)`);
}
const legend = svg.append("g").attr("transform", `translate(12, ${height - 30})`);
d3.range(1, 13).forEach((v, i) => legend.append("rect").attr("x", i * 16).attr("width", 16).attr("height", 8).attr("fill", color(v)));
legend.append("text").attr("y", -4).attr("fill", "currentColor").text("foF2 (MHz): 1 → 12; circle size: MUF(3000)");
return svg.node();