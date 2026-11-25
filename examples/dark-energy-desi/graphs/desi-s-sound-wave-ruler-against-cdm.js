// DESI's standard ruler: the sound waves frozen into matter 380,000 years
// after the Big Bang left a preferred galaxy separation, r_d ≈ 147 Mpc.
// Measured across (DM) and along (DH) the line of sight at seven
// redshifts, each distance is shown divided by what ΛCDM (fitted to DESI
// and the CMB) predicts: on the line at 1 is ΛCDM. The dashed curves are
// the evolving dark energy fitted to all three rulers. Watch z ≈ 0.5–0.7:
// DH below 1 means the expansion rate there was a little faster than ΛCDM
// allows. Hover a point.
const s = data || {};
const pts = s.points || [];
const qcol = {"DM/r_d": "#60a5fa", "DH/r_d": "#f97316", "DV/r_d": "#a78bfa"};
const ratio = (s.curve || []).flatMap((c) => [
  {z: c.z, q: "DM/r_d", r: c.w_dm / c.lcdm_dm}, {z: c.z, q: "DH/r_d", r: c.w_dh / c.lcdm_dh}, {z: c.z, q: "DV/r_d", r: c.w_dv / c.lcdm_dv}]);
const b = s.best || {};
return plot({
  height: Math.max(360, (fit?.height ?? 520) - 30), marginLeft: 56,
  x: {domain: [0, 2.6], label: "redshift z →  (0.5 ≈ 5 billion years ago, 2.3 ≈ 11 billion)"},
  y: {domain: [0.92, 1.08], label: "↑ measured ÷ ΛCDM", grid: true, tickFormat: (v) => v.toFixed(2)},
  color: {domain: Object.keys(qcol), range: Object.values(qcol), legend: true, label: "distance"},
  marks: [
    Plot.ruleY([1], {stroke: "currentColor", strokeOpacity: 0.6}),
    Plot.line(ratio, {x: "z", y: "r", stroke: "q", strokeDasharray: "5,4", strokeWidth: 1.6}),
    Plot.ruleX(pts, {x: (p) => p.z + ({"DM/r_d": -0.015, "DH/r_d": 0.015, "DV/r_d": 0})[p.quantity], y1: (p) => p.ratio - p.ratio_err, y2: (p) => p.ratio + p.ratio_err, stroke: "quantity", strokeWidth: 1.5}),
    Plot.dot(pts, {x: (p) => p.z + ({"DM/r_d": -0.015, "DH/r_d": 0.015, "DV/r_d": 0})[p.quantity], y: "ratio", fill: "quantity", r: 4.5, stroke: "#09090b", tip: true,
      channels: {quantity: "quantity", measured: (p) => `${p.value.toFixed(3)} ± ${p.error.toFixed(3)}`, "ΛCDM": (p) => p.lcdm.toFixed(3),
                 "off by": (p) => `${((p.ratio - 1) / p.ratio_err).toFixed(1)} σ`}}),
    Plot.text([{t: `dashed: w0 = ${b.w0}, wa = ${b.wa}, Ωm = ${b.om} (all three rulers)`}], {frameAnchor: "top-right", text: "t", dx: -6, dy: 6, fontSize: 11}),
  ],
  caption: `DESI DR2 BAO (2025), seven redshift bins from bright galaxies (z 0.3) to the Lyman-α forest (z 2.3), with error bars from DESI's covariance. ΛCDM: Ωm = ${s.lcdm_om}, scale fitted.`,
});