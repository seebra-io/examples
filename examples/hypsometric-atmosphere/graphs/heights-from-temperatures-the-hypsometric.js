// The hypsometric equation against the weather model: layer thickness from the two levels' temperatures alone, against the model's geopotential heights.
// data[0]: layers {dz_model_m, dz_hypsometric_m, error_pct, layer, latitude, below_ground, t_mean, scale_height_km}; data[1]: check {mean_abs_error_pct, max_abs_error_pct, layers}
const [rows, [c]] = data;
const ok = rows.filter(d => !d.below_ground);
const [lo, hi] = d3.extent(ok, d => d.dz_model_m);
return plot({
  height: Math.max(380, (fit?.height ?? 440) - 40),
  x: {type: "log", label: "layer thickness in the model (m, log scale) →", grid: true},
  y: {label: "↑ hypsometric error (%)", grid: true},
  color: {type: "diverging", scheme: "rdbu", domain: [-80, 80], legend: true, label: "latitude (°)"},
  marks: [
    Plot.ruleY([0], {stroke: "currentColor", strokeDasharray: "4,3"}),
    Plot.dot(ok, {x: "dz_model_m", y: "error_pct", fill: "latitude", r: 3.5, tip: true,
      channels: {layer: "layer", "latitude (°)": "latitude", "model Δz (m)": "dz_model_m", "R T̄/g ln(p₁/p₂) (m)": "dz_hypsometric_m", "mean T (K)": "t_mean", "scale height RT/g (km)": "scale_height_km"}}),
    Plot.text([`${c.layers} layers · mean |error| ${c.mean_abs_error_pct}% · largest ${c.max_abs_error_pct}%`], {frameAnchor: "top-right", dx: -6, dy: 6, fill: "currentColor"}),
  ],
  caption: "Every layer between two pressure levels, in every column: its thickness computed as (R_d/g₀) T̄ ln(p₁/p₂) from two temperatures, against the model's heights. "
    + "They agree to a fraction of a percent on average: the heights of pressure surfaces are the integral of temperature. The leftover is mostly humidity: moist air is lighter, so warm, humid low layers "
    + "(tropics, 1000–700 hPa) are thicker than dry-air R_d predicts (the virtual temperature correction), and averaging T linearly across thick layers adds a little more.",
});