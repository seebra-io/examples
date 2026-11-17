// Peak splitting between a film and its substrate, per reflection, against angle.
// data: splitting {pair, hkl, substrate_2theta, split_deg, predicted_split_deg, mismatch_pct}
const rows = Array.isArray(data) ? data : [];
return plot({
  height: Math.max(320, (fit?.height ?? 380) - 20),
  x: {label: "substrate peak 2θ (degrees) →", grid: true},
  y: {label: "↑ |Δ2θ| film − substrate (degrees, log)", type: "log", grid: true},
  color: {legend: true},
  marks: [
    Plot.line(rows, {x: "substrate_2theta", y: d => Math.abs(d.predicted_split_deg), stroke: "pair", strokeDasharray: "4 3", strokeOpacity: 0.7}),
    Plot.dot(rows, {x: "substrate_2theta", y: d => Math.abs(d.split_deg), fill: "pair", r: 4, tip: true,
      channels: {pair: "pair", hkl: "hkl", "split (°)": "split_deg", "−2 tanθ Δa/a (°)": "predicted_split_deg", "lattice mismatch (%)": "mismatch_pct"}}),
  ],
  caption: "Dots: exact splitting from Bragg's law; dashed: the small-mismatch formula Δ2θ = −2 tan θ · Δa/a. AlAs on GaAs (−0.13% mismatch) splits by under 0.05° at (111) but several times more at high angles: "
    + "that is why the mismatch, strain and composition of epitaxial films are measured on high-angle reflections like (004). Ge on Si (4%) is far too mismatched to grow thick without dislocations.",
});