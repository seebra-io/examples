// Where the columns are: 17 points along 20° E, coloured by their 1000–500 hPa mean temperature.
// data: columns {latitude, longitude, elevation, t_mean_c, z500}
const rows = Array.isArray(data) ? data : [];
const w = fit?.width ?? 420, h = Math.max(320, (fit?.height ?? 380) - 10);
const projection = d3.geoOrthographic().rotate([-20, 0]).fitExtent([[10, 10], [w - 10, h - 10]], {type: "Sphere"});
const path = d3.geoPath(projection);
const color = d3.scaleSequential(d3.interpolateTurbo).domain(d3.extent(rows, d => d.t_mean_c));
const svg = d3.create("svg").attr("width", w).attr("height", h).attr("viewBox", [0, 0, w, h]);
svg.append("path").attr("d", path({type: "Sphere"})).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.3);
svg.append("path").attr("d", path(d3.geoGraticule10())).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.08);
svg.append("path").attr("d", path(atlas.land)).attr("fill", "currentColor").attr("fill-opacity", 0.12);
svg.append("path").attr("d", path(atlas.borders)).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.25);
const g = svg.append("g").selectAll("a").data(rows).join("a")
  .attr("href", d => `https://open-meteo.com/en/docs#latitude=${d.latitude}&longitude=${d.longitude}`).attr("target", "_blank");
g.append("circle").attr("transform", d => `translate(${projection([d.longitude, d.latitude])})`).attr("r", 6)
  .attr("fill", d => color(d.t_mean_c)).attr("stroke", "currentColor").attr("stroke-width", 0.5);
g.append("title").text(d => `${d.latitude}° ${d.latitude < 0 ? "S" : "N"}, ${d.longitude}° E · ground ${d.elevation} m\n1000–500 hPa mean temperature ${d.t_mean_c} °C\n500 hPa height ${d.z500} m`);
return svg.node();