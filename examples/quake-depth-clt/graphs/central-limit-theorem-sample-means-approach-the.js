// The central limit theorem: 500 sample means for each sample size n, standardised as z = (mean - μ) / (σ / √n),
// against the standard normal curve (orange). n = 1 is the population itself.
// data[0]: standardised {n, r, mean_km, z, se_km}; data[1]: summary per n {sd_of_means_km, se_predicted_km, skewness_of_means, skewness_predicted, within_1_96}
const [rows, summary] = data;
const step = 0.25;
const curve = d3.range(-4, 4.001, 0.05).map(z => ({z, y: step * Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI)}));
const label = n => {
  const s = summary.find(d => d.n === n);
  return s ? `n = ${n}: sd of means ${s.sd_of_means_km} km (σ/√n = ${s.se_predicted_km}), skewness ${s.skewness_of_means} (γ/√n = ${s.skewness_predicted}), ${(100 * s.within_1_96).toFixed(1)}% within ±1.96` : `n = ${n}`;
};
return plot({
  height: Math.max(460, (fit?.height ?? 560) - 40),
  marginTop: 24,
  fy: {label: null, tickFormat: label, axis: null},
  x: {label: "standardised sample mean z = (mean − μ) / (σ/√n) →", domain: [-4, 6], grid: true},
  y: {label: "↑ share of the 500 samples", tickFormat: "%", grid: true},
  marks: [
    // each facet's label in its top-left corner (a vertical facet axis can't sit on top)
    Plot.text([...new Set(rows.map(d => d.n))], {fy: d => d, text: label, frameAnchor: "top-left", dx: 4, dy: 2, fontWeight: "bold", lineWidth: 90, stroke: "var(--plot-background)", strokeWidth: 3, paintOrder: "stroke"}),
    Plot.rectY(rows, Plot.binX({y: "proportion-facet"}, {x: "z", fy: "n", thresholds: d3.range(-4, 12.001, step), domain: [-4, 6],
      fill: "#a1a1aa", tip: true})),
    Plot.line(summary.flatMap(s => curve.map(c => ({...c, n: s.n}))), {x: "z", y: "y", fy: "n", stroke: "#f97316", strokeWidth: 2}),
    Plot.ruleY([0]),
  ],
  caption: "Notice: the means of 30 or 100 depths fall on the bell curve though single depths are nowhere near normal, and their spread shrinks as σ/√n (km in each header). "
    + "Skewness fades only as 1/√n, so n = 5 is still lopsided: 'n ≥ 30' is a rule of thumb, not a law. "
    + "Caveat: draws are with replacement from one month's quakes, by a deterministic pseudo-random generator, so the same data give the same samples.",
});