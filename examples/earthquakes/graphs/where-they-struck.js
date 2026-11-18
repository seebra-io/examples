// The week's quakes on a world projection: dot size is magnitude, colour is
// depth. Hover a quake for its record, click it for its USGS event page;
// drag to pan, scroll to zoom, double-click to reset.
const width = fit?.width ?? 800;
const height = fit?.height ?? 450;
const [quakes = [], strongest = []] = data;

// --- scales -------------------------------------------------------------
const projection = d3.geoNaturalEarth1().fitSize([width, height], {type: "Sphere"});
const path = d3.geoPath(projection);
const radius = d3.scaleSqrt().domain([4.5, 8]).range([2, 14]);  // magnitude -> px
const depthColor = d => d.depth_km < 70 ? "#f97316" : "#a78bfa"; // shallow quakes do most damage

// --- frame and tooltip ----------------------------------------------------
const wrap = d3.create("div").style("position", "relative").style("width", width + "px").style("height", height + "px");
const svg = wrap.append("svg").attr("width", width).attr("height", height)
  .style("font", "11px sans-serif").style("color", "currentColor");
// the hover box is Seebra's one box (seebra.tooltip): beside the pointer, never
// over it, and the only one on screen (another graph's closes when it opens)
const showTip = (event, html) => seebra.tooltip.show(html, event);
const hideTip = () => seebra.tooltip.hide();

// --- the globe: sphere, graticule, then land and borders (atlas: Natural
// Earth 1:110m, shipped with Seebra). Hovering a country names it and counts
// the week's quakes on its land (most are at sea, on plate boundaries).
const world = svg.append("g");
world.append("path").attr("d", path({type: "Sphere"})).attr("fill", "#0b1220").attr("stroke", "#27272a");
world.append("path").attr("d", path(d3.geoGraticule10())).attr("fill", "none").attr("stroke", "#1f2937")
  .attr("vector-effect", "non-scaling-stroke");
const onLand = new Map(atlas.countries.features.map(f => [f, quakes.filter(q => d3.geoContains(f, [q.lon, q.lat])).length]));
world.append("g").selectAll("path").data(atlas.countries.features).join("path")
  .attr("d", path).attr("fill", "#1c2333").attr("stroke", "none")
  .on("pointerenter", function () { d3.select(this).attr("fill", "#27324a"); })
  .on("pointermove", (event, f) => showTip(event, `<b>${f.properties.name}</b><br>${onLand.get(f)} of the week's ${quakes.length} quakes on its land`))
  .on("pointerleave", function () { d3.select(this).attr("fill", "#1c2333"); hideTip(); });
world.append("path").attr("d", path(atlas.borders)).attr("fill", "none").attr("stroke", "#3f4b63")
  .attr("stroke-width", 0.5).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");
world.append("path").attr("d", path(atlas.land)).attr("fill", "none").attr("stroke", "#52617d")
  .attr("stroke-width", 0.7).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");

// --- the quakes, biggest drawn first so small ones stay on top -----------
const rank = new Map([...quakes].sort((a, b) => b.mag - a.mag).map((d, i) => [d, i + 1]));
const dots = world.append("g").selectAll("circle")
  .data([...quakes].sort((a, b) => b.mag - a.mag)).join("circle")
  .attr("transform", d => `translate(${projection([d.lon, d.lat])})`)
  .attr("r", d => radius(d.mag))
  .attr("fill", depthColor).attr("fill-opacity", 0.6).attr("stroke", "#09090b").attr("stroke-width", 0.5)
  .style("cursor", "pointer")
  .on("pointerenter", function () { d3.select(this).attr("fill-opacity", 1).attr("stroke", "#fff").raise(); })
  .on("pointermove", (event, d) => showTip(event,
    `<b>M${d.mag}</b> (${d.magType}) ${d.place}<br>${d.depth_km} km deep · #${rank.get(d)} of ${quakes.length} this week` +
    `${d.tsunami ? "<br>tsunami alert" : ""}${d.alert ? `<br>PAGER alert: ${d.alert}` : ""}` +
    `<br>${new Date(d.time).toUTCString().slice(0, 22)} UTC<br><span style="color:#a1a1aa">click: USGS event page</span>`))
  .on("pointerleave", function () { d3.select(this).attr("fill-opacity", 0.6).attr("stroke", "#09090b"); hideTip(); })
  .on("click", (event, d) => d.url && window.open(d.url, "_blank", "noopener"));

// --- labels for the five strongest (from the Polars step) ---------------
const labels = world.append("g").style("pointer-events", "none");
strongest.slice(0, 5).forEach(d => {
  const [x, y] = projection([d.lon, d.lat]);
  labels.append("text").attr("x", x + 8).attr("y", y - 6).attr("fill", "#fde68a")
    .attr("paint-order", "stroke").attr("stroke", "#09090b").attr("stroke-width", 3)
    .text(`M${d.mag} ${String(d.place).replace(/^.* of /, "")}`);
});

// --- zoom: dots and strokes keep their screen size ------------------------
const zoom = d3.zoom().scaleExtent([1, 12]).translateExtent([[0, 0], [width, height]]).on("zoom", event => {
  const k = event.transform.k;
  world.attr("transform", event.transform);
  dots.attr("r", d => radius(d.mag) / Math.sqrt(k)).attr("stroke-width", 0.5 / k);
  labels.attr("font-size", 11 / k).selectAll("text").attr("stroke-width", 3 / k);
});
svg.call(zoom).on("dblclick.zoom", () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity));

// --- legend -----------------------------------------------------------------
const legend = svg.append("g").attr("transform", `translate(12,${height - 52})`);
[["shallow (< 70 km deep)", "#f97316"], ["deeper", "#a78bfa"]].forEach(([text, color], i) => {
  legend.append("circle").attr("cx", 5).attr("cy", i * 16).attr("r", 5).attr("fill", color);
  legend.append("text").attr("x", 15).attr("y", i * 16).attr("dy", "0.35em").attr("fill", "currentColor").text(text);
});
legend.append("text").attr("y", 34).attr("dy", "0.35em").attr("fill", "#71717a")
  .text(`${quakes.length} quakes of M4.5+ · size: magnitude (M4.5 to M8)`);
svg.append("text").attr("x", width - 8).attr("y", height - 8).attr("text-anchor", "end").attr("fill", "#71717a")
  .text("hover: details · click: USGS page · drag: pan · scroll: zoom · double-click: reset");
return wrap.node();