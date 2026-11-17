// Bragg's law as a straight line: sin²θ = (λ / 2a)² · (h² + k² + l²).
// data: peaks (allowed reflections)
const rows = (Array.isArray(data) ? data : []).filter(d => d.f_sq > 0).map(d => ({...d, sin2: Math.pow(Math.sin(d.theta_deg * Math.PI / 180), 2)}));
const mats = [...new Set(rows.map(d => d.material))];
const lines = mats.map(m => { const r = rows.find(d => d.material === m); const s = Math.pow(1.5406 / (2 * r.a_A), 2); return {material: m, a: r.a_A, pts: [[0, 0], [48, 48 * s]]}; });
return plot({
  height: Math.max(340, (fit?.height ?? 400) - 20),
  x: {label: "h² + k² + l² →", grid: true, domain: [0, 50]},
  y: {label: "↑ sin²θ", grid: true, domain: [0, 1]},
  color: {legend: true, domain: mats},
  marks: [
    Plot.ruleY([1], {strokeDasharray: "3 3", strokeOpacity: 0.5}),
    ...lines.map(l => Plot.line(l.pts, {stroke: () => l.material, strokeOpacity: 0.35})),
    Plot.dot(rows, {x: "n_sq", y: "sin2", fill: "material", r: 3.5, tip: true, channels: {hkl: "hkl", "2θ (°)": "two_theta_deg", "d (Å)": "d_A", "a (Å)": "a_A"}}),
  ],
  caption: "Each material's reflections lie on a line through the origin with slope (λ/2a)²: a larger cell (InP, Ge) means a steeper line and more reflections fitting under sin²θ = 1. "
    + "The gaps in h²+k²+l² (no 1, 2, 4 for diamond, 5, 6, 7, ...) are the selection rule: indexing an unknown pattern is finding the line and the missing N.",
});