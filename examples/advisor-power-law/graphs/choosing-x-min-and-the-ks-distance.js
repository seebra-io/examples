// Where does the tail start? α and the KS distance for every candidate x_min.
// data: xmin_scan {xmin, alpha, se_alpha, n_tail, ks, ks_noise}
const rows = Array.isArray(data) ? data : [];
const best = rows.reduce((a, d) => (a == null || d.ks < a.ks ? d : a), null) || {};
const long = rows.flatMap(d => [
  {xmin: d.xmin, panel: "MLE exponent α (±1.96 se)", y: d.alpha, lo: d.alpha - 1.96 * d.se_alpha, hi: d.alpha + 1.96 * d.se_alpha, n_tail: d.n_tail, ks: d.ks},
  {xmin: d.xmin, panel: "KS distance (and the 1/√n noise level)", y: d.ks, lo: null, hi: null, noise: d.ks_noise, n_tail: d.n_tail, ks: d.ks},
]);
return plot({
  height: Math.max(420, (fit?.height ?? 480) - 40),
  marginTop: 24,
  fy: {label: null, domain: ["MLE exponent α (±1.96 se)", "KS distance (and the 1/√n noise level)"]},
  x: {label: "x_min: smallest number of students counted as tail →", grid: true},
  y: {label: null, grid: true},
  marks: [
    Plot.areaY(long.filter(d => d.lo != null), {fy: "panel", x: "xmin", y1: "lo", y2: "hi", fill: "#2563eb", fillOpacity: 0.15}),
    Plot.line(long.filter(d => d.noise != null), {fy: "panel", x: "xmin", y: "noise", stroke: "currentColor", strokeOpacity: 0.5, strokeDasharray: "3,3"}),
    Plot.line(long, {fy: "panel", x: "xmin", y: "y", stroke: "#2563eb"}),
    Plot.dot(long, {fy: "panel", x: "xmin", y: "y", r: d => d.xmin === best.xmin ? 6 : 2.5, fill: d => d.xmin === best.xmin ? "#f97316" : "#2563eb", tip: true,
      channels: {"x_min": "xmin", "advisors in the tail": "n_tail", "α": d => long.find(e => e.xmin === d.xmin && e.lo != null)?.y, "KS distance": "ks"}}),
  ],
  caption: `For a true power law, α would level off once x_min passes the start of the tail. Here it climbs steadily, from ${rows[0]?.alpha} at x_min = 1 to ${rows[rows.length - 1]?.alpha} at ${rows[rows.length - 1]?.xmin}: the log-log curve bends downward everywhere. `
    + `The KS distance is smallest at x_min = ${best.xmin} (orange; ${best.n_tail} advisors, KS = ${best.ks} against a noise level of ${best.ks_noise}), so even the best tail fit is only marginally consistent with a power law. `
    + `Hover a point for its tail size. Next: compare with a lognormal or a power law with exponential cutoff (not computed here).`,
});