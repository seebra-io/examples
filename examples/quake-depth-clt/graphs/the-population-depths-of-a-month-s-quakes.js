// The population: depths of this month's M2.5+ earthquakes. Far from normal: most are shallow, a few are hundreds of km deep.
// data[0]: quakes {depth, mag, place, url, ...}; data[1]: population {mean_km, sd_km, median_km, skewness, ...}
const [rows, [pop]] = data;
return plot({
  height: Math.max(280, (fit?.height ?? 340) - 40),
  x: {label: "hypocentre depth (km) →", grid: true},
  y: {label: "↑ earthquakes", grid: true},
  marks: [
    Plot.rectY(rows, Plot.binX({y: "count"}, {x: "depth", thresholds: 60, fill: "#a1a1aa", tip: true})),
    Plot.ruleX([pop.mean_km], {stroke: "#f97316", strokeWidth: 2}),
    Plot.ruleX([pop.median_km], {stroke: "#38bdf8", strokeWidth: 2, strokeDasharray: "4,3"}),
    Plot.text([`mean ${pop.mean_km.toFixed(0)} km (orange) · median ${pop.median_km.toFixed(0)} km (blue) · sd ${pop.sd_km.toFixed(0)} km · skewness ${pop.skewness.toFixed(1)} · ${pop.quakes} quakes`],
      {frameAnchor: "top-right", dy: 4, dx: -4, fill: "currentColor"}),
    Plot.ruleY([0]),
  ],
  caption: "This month's quakes are the population we sample from. Its mean sits far right of the median: a long tail of deep subduction-zone quakes. "
    + "Caveat: the feed mixes networks with different detection limits (many shallow Alaska and US quakes), so this is not the world's depth distribution.",
});