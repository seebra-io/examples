// The supernova ruler: type Ia supernovae explode with nearly the same
// peak brightness, so how faint one looks says how far its light
// travelled. Each dot is one of Pantheon+'s 1,580 Hubble-flow supernovae,
// its magnitude minus what ΛCDM predicts (above 0: fainter, further away);
// the white points are averages in redshift bins. The dashed curve is the
// evolving dark energy fitted to all three rulers. Their absolute
// brightness is not used (it is left free), so only the curve's shape
// counts. Hover a point.
const s = data || {};
return plot({
  height: Math.max(360, (fit?.height ?? 520) - 30), marginLeft: 56,
  x: {type: "log", domain: [0.01, 2.4], ticks: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], tickFormat: (v) => String(v), label: "redshift z (log) →"},
  y: {domain: [-0.5, 0.5], label: "↑ magnitude − ΛCDM (mag)", grid: true},
  marks: [
    Plot.ruleY([0], {stroke: "currentColor", strokeOpacity: 0.6}),
    Plot.dot(s.sn_points || [], {x: "z", y: "residual", r: 1.6, fill: "#60a5fa", fillOpacity: 0.3, tip: true,
      channels: {supernova: "id", error: (d) => `± ${d.err.toFixed(3)} mag`}}),
    Plot.ruleX(s.sn_bins || [], {x: "z", y1: (d) => d.residual - d.err, y2: (d) => d.residual + d.err, stroke: "#fafafa"}),
    Plot.dot(s.sn_bins || [], {x: "z", y: "residual", r: 3.5, fill: "#fafafa", tip: true,
      channels: {supernovae: "n", mean: (d) => `${d.residual.toFixed(3)} ± ${d.err.toFixed(3)} mag`}}),
    Plot.line((s.sn_curve || []).filter((c) => c.z >= 0.01), {x: "z", y: "residual", stroke: "#f97316", strokeDasharray: "5,4", strokeWidth: 2}),
  ],
  caption: "Pantheon+ (Scolnic et al. 2022): corrected peak magnitudes m_B, z > 0.01, Cepheid hosts left out; diagonal errors only (the published covariance with systematics is 1,701 × 1,701 and is not used here).",
});