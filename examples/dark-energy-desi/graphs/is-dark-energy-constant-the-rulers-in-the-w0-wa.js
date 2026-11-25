// The verdict in one plane: dark energy's equation of state today (w0)
// and how it changes (wa). A cosmological constant, ΛCDM, is the cross at
// w0 = −1, wa = 0. Each ruler alone allows a long band; where the bands
// cross is what the data say together. The regions are where the χ² is
// within 2.3 (inner, ≈ 68%) and 6.2 (outer, ≈ 95%) of its best, Ωm free.
// If the cross falls outside a combination's outer region, ΛCDM is
// disfavoured by that combination. Below the diagonal w0 + wa = −1, dark
// energy was "phantom" (w < −1) in the past.
const s = data || {};
const col = {"BAO": "#60a5fa", "SN": "#a3e635", "BAO+CMB": "#a78bfa", "BAO+CMB+SN": "#f97316"};
const cells = [...(s.contours || [])].sort((a, b) => (b.combination === "SN") - (a.combination === "SN")).flatMap((c) => c.cells.filter((x) => x.d < 6.18).map((x) => ({...x, combination: c.combination, inner: x.d < 2.3})));
const v = s.verdict || [];
return plot({
  height: Math.max(380, (fit?.height ?? 520) - 30), marginLeft: 56, marginRight: 230,
  x: {domain: [-1.5, -0.3], label: "w0 (today) →"},
  y: {domain: [-3, 1.2], label: "↑ wa (change with time)", grid: true},
  color: {domain: Object.keys(col), range: Object.values(col), legend: true, label: "rulers"},
  marks: [
    Plot.rect(cells, {x1: (d) => d.w0 - 0.015, x2: (d) => d.w0 + 0.015, y1: (d) => d.wa - 0.04, y2: (d) => d.wa + 0.04, fill: "combination", fillOpacity: (d) => d.inner ? 0.5 : 0.18}),
    Plot.line([[-1.5, 0.5], [-0.3, -0.7]], {stroke: "currentColor", strokeOpacity: 0.35, strokeDasharray: "2,3"}),
    Plot.text([{x: -0.42, y: -0.62, t: "w0 + wa = −1"}], {x: "x", y: "y", text: "t", fontSize: 10, fillOpacity: 0.6, textAnchor: "end"}),
    Plot.ruleX([-1], {strokeOpacity: 0.2}), Plot.ruleY([0], {strokeOpacity: 0.2}),
    Plot.dot([{x: -1, y: 0}], {x: "x", y: "y", symbol: "cross", r: 8, stroke: "#fafafa", strokeWidth: 2.5}),
    Plot.text([{x: -1, y: 0, t: "ΛCDM"}], {x: "x", y: "y", text: "t", dx: 14, dy: -10, fill: "#fafafa", fontWeight: 600}),
    Plot.dot(v.filter((r) => r.combination !== "SN"), {x: "w0", y: "wa", fill: (r) => r.combination, r: 4, stroke: "#09090b", tip: true,
      channels: {rulers: "combination", "Δχ² vs ΛCDM": (r) => r.delta_chi2.toFixed(1), "ΛCDM disfavoured": (r) => `${r.sigma.toFixed(1)} σ`, Ωm: "om"}}),
    Plot.text(v, {frameAnchor: "top-right", x: () => -0.3, y: (r, i) => 1.15 - i * 0.32, dx: 12, textAnchor: "start", fill: (r) => col[r.combination], fontWeight: 600,
      text: (r) => `${r.combination}\nΛCDM off by ${r.sigma.toFixed(1)}σ (Δχ² ${r.delta_chi2.toFixed(1)})`, lineAnchor: "top", fontSize: 11}),
  ],
  caption: "Grid fit: Ωm 0.22–0.42, w0 −1.5…−0.3, wa −3…1.2 (w0 + wa < 0). σ: the two-sided Gaussian equivalent of Δχ² for two extra parameters. DESI DR2 reports 2.8–4.2σ with full CMB and supernova likelihoods.",
});