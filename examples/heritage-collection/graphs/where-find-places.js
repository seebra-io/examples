// Where the records are from: each record that carries coordinates in
// K-samsök (a find place, a church, a place depicted), coloured by record type.
// Hover a dot for the object; click it to pin it and get its links: the
// record at the museum (DigitaltMuseum, samlingar.shm.se, ...), its K-samsök
// entry, the parish in other collections, and the parish's ancient monuments
// in Fornsök (set the parish parameter: the Wider slide). Drag to pan, scroll
// to zoom, double-click to reset.
const width = fit?.width ?? 900;
const height = Math.max(380, (fit?.height ?? 560) - 70);
const [places = [], samples = [], types = []] = data;
const s = samples.find((x) => x.set === "place sample") || {};
const total = types.reduce((a, t) => a + t.records, 0);
const fmt = (n) => (n == null ? "?" : n.toLocaleString("sv-SE"));

// --- colours: one per record type, in order of size ------------------------
const typeNames = [...new Set(places.map((d) => d.type || "other"))];
const color = d3.scaleOrdinal(typeNames, ["#f59e0b", "#38bdf8", "#a78bfa", "#22c55e", "#f472b6", "#e5e7eb"]);

// --- projection: Sweden and its neighbours, or the points if they lie elsewhere
const nordic = new Set(["Sweden", "Norway", "Finland", "Denmark", "Estonia", "Latvia", "Lithuania"]);
const land = atlas.countries.features.filter((f) => nordic.has(f.properties.name));
const sweden = land.find((f) => f.properties.name === "Sweden");
const pts = {type: "MultiPoint", coordinates: places.map((d) => [d.lon, d.lat])};
const inSweden = places.length && sweden ? places.filter((d) => d3.geoContains(sweden, [d.lon, d.lat])).length / places.length : 0;
const frame = inSweden > 0.5 || !places.length ? sweden : pts;
const projection = d3.geoConicConformal().parallels([58, 66]).rotate([-16, 0]).fitExtent([[20, 20], [width - 20, height - 20]], frame);
const path = d3.geoPath(projection);

// --- layout: map, then the pinned record's panel ---------------------------
const wrap = d3.create("div").style("width", width + "px").style("font", "12px system-ui, sans-serif").style("color", "currentColor");
const svg = wrap.append("svg").attr("width", width).attr("height", height).style("display", "block");
const g = svg.append("g");
g.append("g").selectAll("path").data(land).join("path").attr("d", path)
  .attr("fill", (f) => (f === sweden ? "#1f2937" : "#18181b")).attr("stroke", "#3f3f46").attr("stroke-width", 0.6)
  .attr("vector-effect", "non-scaling-stroke");

const tipOf = (d) => `<b>${d.label || d.name || "(no label)"}</b>${d.type ? ` <span style="color:#a1a1aa">${d.type}</span>` : ""}` +
  `<br>${[d.place, d.parish && d.parish !== d.place ? d.parish + " parish" : null, d.municipality, d.province].filter(Boolean).join(", ") || "no place name"}` +
  `<br>${d.dated ? "dated " + d.dated : "no dating"}${d.material ? " · " + d.material : ""}` +
  `<br>picture: ${d.thumbnail ? (d.image_licence || "no licence stated") + (d.image_credit ? ", " + d.image_credit : "") : "none in K-samsök"}` +
  `<br>record licence: ${d.licence || "none stated"}` +
  `<br><span style="color:#a1a1aa">click: pin it, with links to the record and the parish</span>`;

const dots = g.append("g").selectAll("circle").data(places).join("circle")
  .attr("cx", (d) => projection([d.lon, d.lat])[0]).attr("cy", (d) => projection([d.lon, d.lat])[1])
  .attr("r", 4).attr("fill", (d) => color(d.type || "other")).attr("fill-opacity", 0.8)
  .attr("stroke", "#09090b").attr("stroke-width", 0.6).style("cursor", "pointer")
  .on("pointerenter", function () { d3.select(this).attr("stroke", "#fff").raise(); })
  .on("pointermove", (event, d) => seebra.tooltip.show(tipOf(d), event))
  .on("pointerleave", function (event, d) { if (d !== pinned) d3.select(this).attr("stroke", "#09090b"); seebra.tooltip.hide(); })
  .on("click", (event, d) => pin(d));

// --- zoom: dots keep their size ---------------------------------------------
const zoom = d3.zoom().scaleExtent([1, 40]).on("zoom", (event) => {
  g.attr("transform", event.transform);
  dots.attr("r", 4 / Math.sqrt(event.transform.k)).attr("stroke-width", 0.6 / event.transform.k);
});
svg.call(zoom).on("dblclick.zoom", () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity));

// --- legend and what the map can't say ---------------------------------------
const legend = svg.append("g").attr("transform", "translate(12,18)");
typeNames.forEach((t, i) => {
  legend.append("circle").attr("cx", 5).attr("cy", i * 16).attr("r", 5).attr("fill", color(t));
  legend.append("text").attr("x", 15).attr("y", i * 16).attr("dy", "0.35em").attr("fill", "currentColor")
    .text(`${t} (${places.filter((d) => (d.type || "other") === t).length})`);
});
svg.append("text").attr("x", width - 10).attr("y", height - 10).attr("text-anchor", "end").attr("fill", "#a1a1aa")
  .text(`${fmt(places.length)} shown · ${fmt(s.of)} of ${fmt(total)} records have coordinates (${total ? ((100 * (s.of || 0)) / total).toFixed(1) : "?"}%)`);

// --- the pinned record: the next step from it --------------------------------
const panel = wrap.append("div").style("min-height", "52px").style("padding", "8px 4px 0").style("line-height", "1.6");
const say = (html) => panel.html(html);
let pinned = null;
const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener" style="color:#7dd3fc">${text}</a>`;
function pin(d) {
  pinned = d;
  dots.attr("stroke", (x) => (x === d ? "#fff" : "#09090b")).attr("stroke-width", (x) => (x === d ? 2 : 0.6));
  const parish = d.parish || d.place;
  say(`<b>${d.label || d.name}</b> · ${[d.place, d.municipality, d.province].filter(Boolean).join(", ")} · ${d.dated || "undated"}<br>` +
      [d.record && link(d.record, "Open the record ↗"),
       d.uri && link(d.uri.replace(/^http:/, "https:"), "K-samsök entry ↗"),
       parish && link("https://digitaltmuseum.se/search/?q=" + encodeURIComponent(parish), `${parish} in DigitaltMuseum ↗`),
      ].filter(Boolean).join(" · ") +
      (parish ? `<br><span style="color:#a1a1aa">Wider: set <b>parish</b> to <b>${parish}</b> in Parameters, then the last slide shows its ancient monuments in Fornsök and every institution with records from it.</span>` : ""));
}
say(`<span style="color:#a1a1aa">Only records that carry coordinates in K-samsök are here; ${fmt(Math.max(0, total - (s.of || 0)))} have none (the Gaps slide). ` +
    `One page of ${fmt(s.shown)} in K-samsök's order, not a random sample. Click a dot for its links.</span>`);
return wrap.node();
