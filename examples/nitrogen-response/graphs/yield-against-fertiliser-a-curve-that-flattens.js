// Cereal yield against fertiliser use, one dot per country, with the fitted Mitscherlich curve and the straight line it beats.
// data[0]: countries_fit, data[1]: curve {fert_kg_ha, yield_pred, mp}, data[2]: fit (one row)
const [rows, curve, fitRows] = data;
const f = fitRows[0];
const shown = rows.filter(d => d.fert_kg_ha <= 820);
const off = rows.filter(d => d.fert_kg_ha > 820);
const lin = [0, 800].map(x => ({fert_kg_ha: x, y: f.intercept_lin + f.slope_lin * x}));
return plot({
  height: Math.max(420, (fit?.height ?? 520) - 40),
  x: {label: "fertiliser use (kg N + P₂O₅ + K₂O per ha of arable land) →", domain: [0, 820], grid: true},
  y: {label: "↑ cereal yield (kg per ha)", grid: true},
  color: {legend: true, label: "region"},
  marks: [
    Plot.line(lin, {x: "fert_kg_ha", y: "y", stroke: "currentColor", strokeDasharray: "4,3", strokeOpacity: 0.5}),
    Plot.line(curve, {x: "fert_kg_ha", y: "yield_pred", stroke: "#f97316", strokeWidth: 2.5, tip: true,
      channels: {"fitted yield (kg/ha)": "yield_pred", "kg grain per extra kg": "mp"}}),
    Plot.dot(shown.filter(d => d.in_fit), {x: "fert_kg_ha", y: "yield_kg_ha", fill: "region", r: 3.5, fillOpacity: 0.8, href: "link", target: "_blank", tip: true,
      channels: {country: "country", income: "income", "fertiliser year": "fert_year", "yield year": "yield_year",
        "fitted yield (kg/ha)": "yield_pred", "residual (%)": "resid_pct", "kg grain per extra kg (curve)": "mp",
        "kg grain per kg fertiliser (average)": "grain_per_kg_fert", "irrigated (% of agric. land)": "irrigated_pct",
        "arable land (1,000 ha)": "arable_kha", "fit": "why_out"}}),
    Plot.dot(shown.filter(d => !d.in_fit), {x: "fert_kg_ha", y: "yield_kg_ha", symbol: "times", stroke: "currentColor", strokeOpacity: 0.6, r: 3.5, href: "link", target: "_blank", tip: true,
      channels: {country: "country", income: "income", "fertiliser year": "fert_year", "yield year": "yield_year",
        "fitted yield (kg/ha)": "yield_pred", "residual (%)": "resid_pct", "kg grain per extra kg (curve)": "mp",
        "kg grain per kg fertiliser (average)": "grain_per_kg_fert", "irrigated (% of agric. land)": "irrigated_pct",
        "arable land (1,000 ha)": "arable_kha", "fit": "why_out"}}),
  ],
  caption: `Each dot a country (latest year each reports; hover for the years and click for its World Bank page). Orange: the Mitscherlich curve fitted to ${f.countries} countries, `
    + `Y = ${f.Y0_kg_ha} + ${f.A_kg_ha}·(1 − e^(−${f.c}·N)) kg/ha (R² ${f.r2}); dashed: the best straight line (R² ${f.r2_lin}). `
    + `Half of the response comes in the first ${f.half_response_kg_ha} kg/ha (95% profile interval ${f.half_lo}–${f.half_hi}). Crosses are left out of the fit (tiny arable area, or fertiliser spread on pasture and plantations)`
    + (off.length ? `; off the chart beyond 820 kg/ha: ${off.map(d => d.country + " " + Math.round(d.fert_kg_ha)).join(", ")}.` : ".")
    + " Caveat: across countries the curve also carries climate, irrigation, seed and crop mix; a field trial's response is steeper and crop-specific.",
});