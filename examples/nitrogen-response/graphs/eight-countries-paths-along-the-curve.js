// Countries' paths through the years (fertiliser → yield), over the cross-country curve.
// data[0]: paths {country, year, fert_kg_ha, yield_kg_ha, grain_per_kg_fert, link}, data[1]: curve
const [rows, curve] = data;
const last = d3.groups(rows, d => d.country).map(([c, v]) => v[v.length - 1]);
return plot({
  height: Math.max(420, (fit?.height ?? 520) - 40),
  x: {label: "fertiliser use (kg nutrients per ha of arable land) →", grid: true},
  y: {label: "↑ cereal yield (kg per ha)", grid: true},
  color: {legend: true, label: "country"},
  marks: [
    Plot.line(curve, {x: "fert_kg_ha", y: "yield_pred", stroke: "currentColor", strokeOpacity: 0.35, strokeDasharray: "4,3"}),
    Plot.line(rows, {x: "fert_kg_ha", y: "yield_kg_ha", stroke: "country", z: "country", strokeWidth: 1.5, markerEnd: "arrow", curve: "catmull-rom"}),
    Plot.dot(rows, {x: "fert_kg_ha", y: "yield_kg_ha", fill: "country", r: 2.5, href: "link", target: "_blank", tip: true,
      channels: {country: "country", year: "year", "kg grain per kg fertiliser": "grain_per_kg_fert"}}),
    Plot.text(last, {x: "fert_kg_ha", y: "yield_kg_ha", text: d => `${d.country} ${d.year}`, dx: 6, textAnchor: "start", fill: "country", fontSize: 10}),
  ],
  caption: "Each line one country, year by year (arrow: the latest year); dashed: the cross-country curve. "
    + "A path that climbs steeply gained yield from more fertiliser (steep part); one that runs right along the top gained little; one that turns left (less fertiliser) without losing yield made its nitrogen work harder. "
    + "Hover a point for its year and grain per kg; click for the country's fertiliser series. Caveat: yields swing with the weather year to year, so read the trend, not one step.",
});