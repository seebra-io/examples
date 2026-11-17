// Battery EVs: the extra energy the highway costs per 100 km, by body type.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: fit?.height ?? 260, marginLeft: 70,
  x: {label: "highway − city energy (kWh per 100 km, median) →", grid: true},
  y: {label: null, domain: rows.map(d => d.body)},
  marks: [
    Plot.barX(rows, {x: "extra_kwh_100km", y: "body", fill: "#2563eb", fillOpacity: 0.8, tip: true,
      channels: {body: "body", variants: "variants", "city (kWh/100 km)": "city_kwh_100km", "highway (kWh/100 km)": "hwy_kwh_100km", "highway change (%)": "highway_change_pct", "median EPA range (mi)": "median_range_mi"}}),
    Plot.ruleX([0]),
  ],
  caption: "At highway speed drag dominates, and drag force is ½ ρ Cd A v²: a pickup's big, blunt front (high Cd × frontal area A) costs several times as much extra energy as a low, slippery car's. That is why the same battery takes a sedan much further on the motorway than a pickup.",
});