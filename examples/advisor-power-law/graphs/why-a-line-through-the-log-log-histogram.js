// Why not fit a line to the histogram: the log-log histogram with its least-squares line against the maximum-likelihood tail.
// data[0]: out_deg {k, n, share}, data[1]: naive {slope_hist, intercept_hist, alpha_hist, alpha_ccdf, floor_points}, data[2]: curves (share_tail), data[3]: best
const [hist, naive, curves, best] = data;
const nv = (naive || [])[0] || {}, b = (best || [])[0] || {};
const ks = hist.map(d => d.k);
const [lo, hi] = d3.extent(ks);
const ls = [lo, hi].map(k => ({k, y: Math.pow(10, nv.intercept_hist + nv.slope_hist * Math.log10(k)), model: `least squares on the histogram: α = ${nv.alpha_hist}`}));
const ml = (curves || []).filter(d => d.network === "students per advisor" && d.share_tail > 0).map(d => ({k: d.k, y: d.share_tail, model: `maximum likelihood, k ≥ ${b.xmin}: α = ${b.alpha} ± ${(1.96 * b.se_alpha).toFixed(2)}`}));
const floor = 1 / (hist[0]?.total || 1);
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 40),
  x: {type: "log", label: "k: doctoral students per advisor (log scale) →", grid: true},
  y: {type: "log", label: "↑ P(K = k): share of advisors with exactly k (log scale)", grid: true},
  color: {legend: true},
  marks: [
    Plot.ruleY([floor], {stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "2,2", tip: true, title: () => `one advisor out of ${hist[0]?.total}: the floor where a k seen once sits`}),
    Plot.line([...ls, ...ml], {x: "k", y: "y", z: "model", stroke: "model", strokeWidth: 1.8, tip: true}),
    Plot.dot(hist, {x: "k", y: "share", r: 3, fill: d => d.n === 1 ? "#ef4444" : "#71717a", href: "link", target: "_blank", tip: true,
      channels: {"advisors with exactly k": "n", "share": "share"}}),
  ],
  caption: `Grey dots: the histogram of students per advisor; red: the ${nv.floor_points} values of k that only one advisor has, piled on the floor 1/N. `
    + `A straight line through all dots weights those noisy singletons like the ${hist[0]?.n} advisors at k = 1, and gives α = ${nv.alpha_hist} (on the CCDF, α = ${nv.alpha_ccdf}). `
    + `Maximum likelihood uses every advisor once, and the KS scan picks where the tail starts: α = ${b.alpha}. Lesson (Clauset, Shalizi & Newman 2009): a line on a log-log plot is not an estimate, and not evidence of a power law.`,
});