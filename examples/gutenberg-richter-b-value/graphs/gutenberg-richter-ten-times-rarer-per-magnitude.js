// Gutenberg–Richter: how many quakes of at least magnitude M (dots) and in each 0.1 bin (bars), on a log scale, with the fitted law above Mc.
// data[0]: fmd {m, n, n_at_least}; data[1]: bvalue {mc, b, b_se_aki, b_se_shi_bolt, a, quakes, expected_m7_per_year}
const [rows, [fitb]] = data;
const ms = d3.range(fitb.mc, d3.max(rows, d => d.m) + 0.05, 0.1);
const law = ms.map(m => ({m, n: Math.pow(10, fitb.a - fitb.b * (m - 0.05))}));
return plot({
  height: Math.max(380, (fit?.height ?? 440) - 40),
  x: {label: "magnitude M →", grid: true},
  y: {type: "log", label: "↑ earthquakes in 2025 (log scale)", grid: true, tickFormat: "~s"},
  marks: [
    Plot.rectY(rows, {x1: d => d.m - 0.05, x2: d => d.m + 0.05, y1: 0.8, y2: "n", fill: "#a1a1aa", fillOpacity: 0.5, tip: true, channels: {M: "m", "quakes in bin": "n"}}),
    Plot.dot(rows, {x: "m", y: "n_at_least", fill: "#38bdf8", r: 3, tip: true, channels: {M: "m", "quakes ≥ M": "n_at_least", "share of the year's energy in this bin": "energy_share"}}),
    Plot.line(law, {x: "m", y: "n", stroke: "#f97316", strokeWidth: 2}),
    Plot.ruleX([fitb.mc], {stroke: "#f97316", strokeDasharray: "4,3"}),
    Plot.text([`log₁₀ N(≥M) = ${fitb.a} − ${fitb.b} M  ·  b = ${fitb.b} ± ${fitb.b_se_shi_bolt} (Shi–Bolt) from ${fitb.quakes} quakes ≥ Mc = ${fitb.mc}`],
      {frameAnchor: "top-right", dx: -6, dy: 6, fill: "currentColor"}),
  ],
  caption: "Blue: the cumulative count; it falls on a straight line on log axes, ten times fewer quakes per magnitude unit (b ≈ 1). Bars: quakes per 0.1 bin; they stop rising at the catalogue's floor "
    + "(M 4.5 here: below it the search drops quakes), and the maximum-curvature rule puts the completeness magnitude Mc 0.2 above the fullest bin (dashed). "
    + "b is fitted with Aki's maximum-likelihood estimator, not a line through the dots (the dots are cumulative and not independent).",
});