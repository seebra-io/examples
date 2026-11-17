// Wahlund's prediction tested: for each pooled sample (ALL, and each
// super-population over its own populations), the heterozygote deficit F
// it shows against F_ST, the deficit the spread of its populations'
// allele frequencies predicts. On the diagonal, pooling explains the
// whole departure from Hardy–Weinberg. Hover for the numbers.
const rows = (Array.isArray(data) ? data : []).filter(d => d.fst != null && d.F_observed != null);
const m = Math.max(0.1, d3.max(rows, d => Math.max(d.fst, d.F_observed)) * 1.08);
return plot({
  height: Math.max(380, (fit?.height ?? 440) - 20),
  x: {label: "F_ST predicted from the populations' frequencies →", domain: [-0.05, m], grid: true},
  y: {label: "↑ F observed in the pooled sample (1 − H_obs/H_exp)", domain: [-0.05, m], grid: true},
  color: {legend: true, label: "variant"},
  marks: [
    Plot.link([{a: -0.05, b: m}], {x1: "a", y1: "a", x2: "b", y2: "b", stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "4 3"}),
    Plot.dot(rows, {x: "fst", y: "F_observed", fill: "gene", r: d => d.pooled === "ALL" ? 7 : 4.5, fillOpacity: 0.85, tip: true,
      channels: {variant: "rsid", "pooled sample": "pooled", populations: "populations", N: "N", "p range": d => `${d.p_min}–${d.p_max}`,
                 "heterozygotes obs / exp": d => `${d.n_het} / ${d.e_het}`, "χ²": "chi2", "p-value": "p_value"}}),
    Plot.text(rows.filter(d => d.pooled === "ALL"), {x: "fst", y: "F_observed", text: d => `ALL ${d.gene}`, dx: 9, textAnchor: "start", fontSize: 10}),
  ],
  caption: "Large dots: ALL (26 populations pooled); small: each super-population pooled. Dashed: F observed = F_ST.",
});