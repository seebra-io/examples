// Forensics: the star's mass recovered from each orbit, against the catalogue mass: log₁₀(M_Kepler / M★) per discovery method.
// data[0]: orbits {log_ratio, discoverymethod, ...}; data[1]: by_method {discoverymethod, planets, share_consistent, mass_spread_pct}
const [rows, methods] = data;
const keep = methods.filter(m => m.planets >= 10).map(m => m.discoverymethod);
const label = m => {
  const s = methods.find(d => d.discoverymethod === m);
  return `${m}: ${s.planets} planets, ${(100 * s.share_consistent).toFixed(0)}% agree to <1%`;
};
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 40),
  marginLeft: 60, marginTop: 20,
  fy: {label: null, domain: keep, tickFormat: label, axis: null},
  x: {label: "log₁₀ (mass from the orbit / catalogue mass of the star) →", domain: [-0.5, 0.5], grid: true},
  y: {label: "↑ planets", type: "sqrt", grid: true},
  marks: [
    // each facet's label in its top-left corner (a vertical facet axis can't sit on top)
    Plot.text(keep, {fy: d => d, text: label, frameAnchor: "top-left", dx: 4, dy: 2, fontWeight: "bold", lineWidth: 90, stroke: "var(--plot-background)", strokeWidth: 3, paintOrder: "stroke"}),
    Plot.rectY(rows.filter(d => keep.includes(d.discoverymethod) && Math.abs(d.log_ratio) <= 0.5),
      Plot.binX({y: "count"}, {x: "log_ratio", fy: "discoverymethod", thresholds: d3.range(-0.5, 0.5001, 0.01), fill: "#a1a1aa", tip: true})),
    Plot.ruleX([0], {stroke: "#f97316", strokeWidth: 1.5}),
    Plot.ruleY([0]),
  ],
  caption: "If a and P were both measured and M★ were right, these would be narrow bells around 0. Instead each method has a spike exactly at 0 (a was computed with Kepler's law) "
    + "and a spread of ±0.05–0.1 dex: the planet's a and the archive's M★ come from different papers with different stellar models. "
    + "Imaging and microlensing measure a without the law (projected separation, Einstein radius), so they scatter most. A 0.1 dex spread is a 26% difference in mass.",
});