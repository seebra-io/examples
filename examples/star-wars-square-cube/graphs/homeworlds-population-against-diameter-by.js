// Expand: the homeworlds. Population against diameter on log axes, coloured by main climate, sized by SWAPI residents.
// data: worlds {name, climate, climate_main, terrain, population, diameter_km, density_per_km2, gravity_g, water_pct, residents_n, films_n, weighed, mean_heavier_by, who, wiki}
const rows = (Array.isArray(data) ? data : []).filter(d => d.population > 0 && d.diameter_km > 0);
const top = d3.groupSort(rows, g => -g.length, d => d.climate_main).slice(0, 6);
return plot({
  height: Math.max(380, (fit?.height ?? 440) - 40),
  x: {type: "log", label: "diameter (km, log scale) →", grid: true},
  y: {type: "log", label: "↑ population (log scale)", grid: true},
  r: {range: [3, 12]},
  color: {domain: [...top, "other"], range: [...d3.schemeTableau10.slice(0, 6), "#a1a1aa"], legend: true, label: "climate"},
  marks: [
    // Earth for scale: 12,742 km, 8 billion people
    Plot.dot([{d: 12742, p: 8e9}], {x: "d", y: "p", symbol: "plus", r: 7, stroke: "currentColor", tip: true, title: () => "Earth: 12,742 km, 8 billion people (for scale)"}),
    Plot.dot(rows, {x: "diameter_km", y: "population", r: "residents_n", fill: d => top.includes(d.climate_main) ? d.climate_main : "other", fillOpacity: 0.8,
      stroke: "white", strokeWidth: 0.5, href: "wiki", target: "_blank", tip: true,
      channels: {planet: "name", climate: "climate", terrain: "terrain", "gravity (standard)": "gravity_g", "surface water (%)": "water_pct",
        "people per km² of disc": "density_per_km2", "SWAPI residents": "residents_n", "e.g.": "who", "their mass ÷ the law": "mean_heavier_by"}}),
    Plot.text(rows.filter(d => d.population > 1e10 || d.population < 1e5 || d.residents_n >= 3), {x: "diameter_km", y: "population", text: "name", dx: 7, textAnchor: "start", fontSize: 9, fill: "currentColor"}),
  ],
  caption: "Populations span nine orders of magnitude on planets of nearly one size (diameters 4,200–19,700 km, Bespin's gas giant aside): population is plot, not geography. "
    + "Coruscant's trillion is 125 Earths on an Earth-sized world. Hover a world for its climate, gravity and the weight of the characters from there; "
    + "25 of the 59 named planets have no population or diameter ('unknown') and are left out.",
});