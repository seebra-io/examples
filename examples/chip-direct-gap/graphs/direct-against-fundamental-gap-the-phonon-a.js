// Indirect against direct: how far above the diagonal a material sits is how much energy
// an electron must hand to the lattice (a phonon) before it can recombine with a hole.
// data: classified
const rows = (Array.isArray(data) ? data : []).filter(d => d.family !== "other");
const pretty = f => ({AsGa: "GaAs", SeZn: "ZnSe", SZn: "ZnS", TeZn: "ZnTe", OZn: "ZnO", CSi: "SiC", ClNa: "NaCl", AsIn: "InAs", BrCu: "CuBr", ClCu: "CuCl", AsB: "BAs"})[f] || f;
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 20),
  x: {label: "fundamental gap (eV, PBE) →", grid: true, domain: [0, 7]},
  y: {label: "↑ smallest direct (vertical) gap (eV, PBE)", grid: true, domain: [0, 9]},
  color: {legend: true, label: "family"},
  marks: [
    Plot.line([[0, 0], [7, 7]], {stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "4 3"}),
    Plot.text([[5.6, 5.6]], {text: ["direct: on the line"], rotate: -45, dy: -8, fill: "currentColor", fillOpacity: 0.6}),
    Plot.dot(rows, {x: "gap_ev", y: "gap_direct_ev", fill: "family", r: 4.5, href: "link", target: "_blank", tip: true,
      channels: {material: d => pretty(d.formula), "direct − gap (eV)": "margin_ev", gap: "gap_type", "Δχ": "delta_chi"}}),
    Plot.text(rows, {x: "gap_ev", y: "gap_direct_ev", text: d => pretty(d.formula), dx: 6, textAnchor: "start", fontSize: 9, fill: "currentColor", fillOpacity: 0.75}),
  ],
  caption: "Points on the dashed line have a direct gap. Si sits about 1.9 eV above it, GaP only 0.02 eV (it emits weakly, which is why early green LEDs were nitrogen-doped GaP), GaAs and GaN on it. "
    + "Alloys move a material along these axes: AlGaAs and GaAsP stay direct up to a crossover composition. Click a point for its Alexandria entry.",
});