// The marginal product: kg of grain one more kg of fertiliser buys, along the fitted curve, with every country placed on it.
// data[0]: curve {fert_kg_ha, mp}, data[1]: bands {band, lo, hi, gain_kg_ha, per_kg}, data[2]: countries_fit, data[3]: fit
const [curve, bands, rows, fitRows] = data;
const f = fitRows[0];
const pts = rows.filter(d => d.in_fit);
return plot({
  height: Math.max(420, (fit?.height ?? 520) - 40),
  x: {label: "fertiliser use (kg nutrients per ha of arable land) →", domain: [0, 800], grid: true},
  y: {label: "↑ kg of grain per extra kg of fertiliser", grid: true},
  color: {legend: true, domain: ["steep: 10+ kg grain per extra kg", "bend: 3-10 kg per extra kg", "flat: under 3 kg per extra kg"], range: ["#16a34a", "#eab308", "#dc2626"], label: "where the country sits"},
  marks: [
    Plot.rectY(bands, {x1: "lo", x2: "hi", y: "per_kg", fill: "#a1a1aa", fillOpacity: 0.35, inset: 1, tip: true,
      channels: {band: "band", "grain gained in this band (kg/ha)": "gain_kg_ha", "share of the whole response": "share_of_total"}}),
    Plot.line(curve, {x: "fert_kg_ha", y: "mp", stroke: "#f97316", strokeWidth: 2}),
    Plot.ruleY([5, 1], {stroke: "currentColor", strokeOpacity: 0.3, strokeDasharray: "2,3"}),
    Plot.dot(pts, {x: "fert_kg_ha", y: "mp", fill: "position", r: 4, href: "link", target: "_blank", tip: true,
      channels: {country: "country", "fertiliser (kg/ha)": "fert_kg_ha", "yield (kg/ha)": "yield_kg_ha",
        "kg grain per extra kg (curve)": "mp", "kg grain per kg (average)": "grain_per_kg_fert", "residual (%)": "resid_pct"}}),
  ],
  caption: `Grey bars: grain each successive 50 kg/ha buys, per kg. The first 50 kg/ha buy ${f.gain_first_50} kg of grain (${f.per_kg_first_50} kg per kg); `
    + `the next 200 kg/ha buy ${f.gain_50_to_250} kg (${f.per_kg_50_to_250} kg per kg). One more kg returns 5 kg of grain at ${f.n_at_mp5} kg/ha and 1 kg at ${f.n_at_mp1} kg/ha (dotted lines). `
    + "Past the bend the extra nitrogen is not taken up by the crop: it leaves as nitrate in water and N₂O in the air. "
    + "Caveat: the marginal product is the fitted curve's slope, read at each country's rate; the country's own response can differ (see its residual).",
});