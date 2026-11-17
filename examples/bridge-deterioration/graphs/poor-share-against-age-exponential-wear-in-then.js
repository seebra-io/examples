// Poor share against age on a log axis: a straight line is exponential growth. data[0]: cohorts, data[1]: hazard (one row).
const [cohorts, fitRows] = data;
const rows = (cohorts || []).filter(d => d.share_poor > 0);
const f = (fitRows || [])[0] || {};
const curve = d3.range(0, 131, 2.5).map(a => ({age: a, share: Math.exp(f.intercept + f.growth_per_year * a), fitted: a >= 5 && a < 45}));
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 40),
  x: {label: "age in 2025 (years) →", grid: true, domain: [0, 130]},
  y: {type: "log", label: "↑ share of bridges in poor condition (lowest rating ≤ 4, log scale)", tickFormat: "%", grid: true, domain: [0.0008, 0.6]},
  r: {range: [2, 12], label: "bridges"},
  marks: [
    Plot.line(curve, {x: "age", y: "share", stroke: "#f97316", strokeDasharray: d => d.fitted ? null : "4,3", strokeWidth: 1.5}),
    Plot.line(curve.filter(d => d.fitted), {x: "age", y: "share", stroke: "#f97316", strokeWidth: 2.5}),
    Plot.ruleX([50], {stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "2,3"}),
    Plot.text([{x: 50, y: 0.5}], {x: "x", y: "y", text: () => "50-year design life (pre-1990s AASHTO practice)", textAnchor: "start", dx: 4, fontSize: 10}),
    Plot.dot(rows, {x: "age_mid", y: "share_poor", r: "bridges", fill: "#dc2626", fillOpacity: 0.75, stroke: "white", href: "link", target: "_blank", tip: true,
      channels: {built: "built", bridges: "bridges", "poor bridges": "poor", "share poor": d => (100 * d.share_poor).toFixed(2) + "%",
                 "share good (≥7)": d => (100 * d.share_good).toFixed(1) + "%", "mean lowest rating": "mean_rating"}}),
  ],
  caption: `Each dot is a 5-year cohort, sized by its bridges; click one for its poor bridges, record by record, on the FHWA/BTS server. `
    + `Up to about 45 years the poor share grows exponentially (orange: ln share = ${f.intercept} + ${f.growth_per_year}·age, r² = ${f.r2}): it doubles every ${f.doubling_years} years. `
    + `Then it bends: from 45 to 75 years it only goes from about 7% to 11%, the age at which rehabilitation and replacement hold it down, and climbs again past 95 as the oldest bridges outrun them. `
    + `Dashed: the wear-in law extrapolated; at 50 years it predicts ${(100 * f.share_poor_at_50).toFixed(1)}% poor, against about 7% observed: the gap is the work done on bridges in their fifth and sixth decades.`,
});
