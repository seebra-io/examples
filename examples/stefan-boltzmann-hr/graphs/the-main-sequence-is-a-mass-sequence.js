// The main sequence is a mass sequence: luminosity against FLAME's mass for main-sequence stars, with the fitted power law L ∝ M^α.
// data[0]: stars {mass_flame, lum, stage, teff, star, link}; data[1]: ml {alpha, intercept, se_alpha, main_sequence_stars, scatter_dex}
const [rows, [f]] = data;
const ms = rows.filter(d => d.stage === "main sequence" && d.mass_flame > 0);
const [lo, hi] = d3.extent(ms, d => d.mass_flame);
const line = d3.range(0, 41).map(i => { const m = lo * Math.pow(hi / lo, i / 40); return {m, L: Math.pow(10, f.intercept + f.alpha * Math.log10(m))}; });
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 40),
  x: {type: "log", label: "mass M/M☉ (FLAME, log scale) →", grid: true},
  y: {type: "log", label: "↑ luminosity L/L☉ (log scale)", grid: true},
  color: {type: "linear", scheme: "turbo", reverse: true, legend: true, label: "T (K)"},
  marks: [
    Plot.dot(ms, {x: "mass_flame", y: "lum", fill: "teff", r: 2, fillOpacity: 0.75, href: "link", target: "_blank", tip: true, channels: {star: "star", "R/R☉": "radius_sb", "age (Gyr)": "age_flame"}}),
    Plot.line(line, {x: "m", y: "L", stroke: "currentColor", strokeWidth: 1.5}),
    Plot.text([`L ∝ M^${f.alpha} ± ${f.se_alpha} (${f.main_sequence_stars} stars, scatter ${f.scatter_dex} dex)`], {frameAnchor: "top-left", dx: 6, dy: 6, fill: "currentColor"}),
  ],
  caption: "Along the main sequence, a star's mass sets everything: doubling the mass makes it about 2^α times brighter, which is why massive stars burn out in millions of years and red dwarfs last trillions. "
    + "Caveat: FLAME's masses come from stellar evolution models fitted to L and T, so this slope partly restates the models; a model-free test needs binaries with dynamical masses.",
});