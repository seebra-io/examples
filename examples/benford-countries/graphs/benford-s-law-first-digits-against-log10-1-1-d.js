// Benford's law: the share of each first digit, per quantity, against log10(1 + 1/d).
// data[0]: benford {quantity, digit, n, total, share, benford, lo, hi, chi2, p_value, mad}
// data[1]: countries (the raw values, for how many orders of magnitude each quantity spans)
const [rows, countries] = data;
const cols = {"population": "population", "land area (km²)": "land_km2", "GDP (current US$)": "gdp_usd", "CO₂ emissions (Mt)": "co2_mt"};
const span = q => {
  const v = (countries || []).map(c => c[cols[q]]).filter(x => x > 0);
  return v.length ? Math.log10(d3.max(v) / d3.min(v)).toFixed(1) : "?";
};
const label = q => {
  const r = rows.find(d => d.quantity === q);
  return `${q}: n = ${r.total}, χ² = ${r.chi2} (8 df, p = ${r.p_value}), MAD = ${r.mad} (chance alone ≈ ${r.mad_by_chance}), spans ${span(q)} orders of magnitude`;
};
const quantities = [...new Set(rows.map(d => d.quantity))];
return plot({
  height: Math.max(420, (fit?.height ?? 520) - 40),
  marginTop: 24,
  fy: {label: null, domain: quantities, tickFormat: label, axis: null},
  x: {label: "first significant digit", type: "band"},
  y: {label: "↑ share of countries", tickFormat: "%", grid: true},
  marks: [
    // each facet's label in its top-left corner (a vertical facet axis can't sit on top)
    Plot.text(quantities, {fy: d => d, text: label, frameAnchor: "top-left", dx: 4, dy: 2, fontWeight: "bold", lineWidth: 90, stroke: "var(--plot-background)", strokeWidth: 3, paintOrder: "stroke"}),
    Plot.barY(rows, {fy: "quantity", x: "digit", y: "share", fill: "#a1a1aa", fillOpacity: 0.8, tip: true,
      channels: {countries: "n", "Benford share": "benford", "expected countries": "expected"}}),
    // the band a sample of this size would fall in 95% of the time if the law held exactly
    Plot.ruleX(rows, {fy: "quantity", x: "digit", y1: "lo", y2: "hi", stroke: "#f97316", strokeOpacity: 0.5, strokeWidth: 6}),
    Plot.dot(rows, {fy: "quantity", x: "digit", y: "benford", fill: "#f97316", r: 3}),
    Plot.line(rows, {fy: "quantity", x: "digit", y: "benford", stroke: "#f97316", strokeWidth: 1.5}),
    Plot.ruleY([0]),
  ],
  caption: "Grey bars: observed shares; orange: Benford's log10(1 + 1/d), with the 95% band for this many countries. Notice that 1 leads about 30% of the time and 9 under 5%: "
    + "quantities that grow multiplicatively and span several orders of magnitude are spread evenly on a log scale. "
    + "Caveat: ~215 countries per quantity is a small sample, so χ² can't see small departures (and with millions of values it flags trivial ones); "
    + "MAD (mean absolute deviation of the shares, Nigrini's measure) is a size of the departure, but at this n chance alone gives about 0.016, so Nigrini's thresholds (set for thousands of values) don't apply. Conformity is not proof of honest data.",
});