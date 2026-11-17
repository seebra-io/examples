// The Mooser–Pearson map: electronegativity difference against mean principal quantum number,
// each octet compound coloured by the coordination of its ground state, with Fisher's line.
// data[0]: scored {formula, family, structure, coordination, delta_chi, n_bar, score, lda_right, link, threshold}; data[1]: lda {slope, intercept}
const [rows, lda] = [data[0] || [], (data[1] || [])[0] || {}];
const pretty = f => ({AsGa: "GaAs", SeZn: "ZnSe", SZn: "ZnS", TeZn: "ZnTe", OZn: "ZnO", CSi: "SiC", ClNa: "NaCl", AsIn: "InAs", BrCu: "CuBr", ClCu: "CuCl", CuI: "CuI", AsB: "BAs", OMg: "MgO", MgO: "MgO", BeO: "BeO", ClK: "KCl", FLi: "LiF", CdTe: "CdTe"})[f] || f;
const xs = [0, 3.4];
const line = xs.map(x => ({x, y: lda.intercept + lda.slope * x}));
const t = rows.length ? rows[0].threshold : null;
return plot({
  height: Math.max(420, (fit?.height ?? 500) - 20),
  x: {label: "Δχ: Pauling electronegativity difference →", domain: [0, 3.4], grid: true},
  y: {label: "↑ n̄: mean principal quantum number (period) of A and B", domain: [1.5, 6.2], grid: true},
  color: {domain: ["tetrahedral (4)", "octahedral (6)", "cubic (8)", "other"], range: ["#f97316", "#0ea5e9", "#a855f7", "#a1a1aa"], legend: true, label: "ground-state coordination"},
  symbol: {domain: ["I-VII", "II-VI", "III-V", "IV-IV"], legend: true, label: "family"},
  marks: [
    Plot.line(line, {x: "x", y: "y", stroke: "currentColor", strokeDasharray: "5 3", strokeOpacity: 0.7}),
    t != null ? Plot.ruleX([t], {stroke: "#ef4444", strokeOpacity: 0.5}) : null,
    Plot.dot(rows, {x: "delta_chi", y: "n_bar", stroke: "coordination", fill: "coordination", fillOpacity: 0.25, symbol: "family", r: 5, href: "link", target: "_blank", tip: true,
      channels: {compound: d => pretty(d.formula), structure: "structure", "space group": "sg", "Δχ": "delta_chi", "n̄": "n_bar", "Fisher score (> 0: tetrahedral)": "score", "line right?": d => d.lda_right == null ? "not tested" : d.lda_right ? "yes" : "no", "PBE gap (eV)": "gap_ev"}}),
    Plot.text(rows, {x: "delta_chi", y: "n_bar", text: d => pretty(d.formula), dy: -9, fontSize: 9, fill: "currentColor", fillOpacity: 0.7}),
  ],
  caption: `Dashed: Fisher's linear discriminant between tetrahedral and octahedral ground states (n̄ = ${lda.intercept} + ${lda.slope}·Δχ); red: the best single threshold, Δχ = ${t}. `
    + "Tetrahedral (zincblende, wurtzite) compounds sit at small electronegativity difference and small, light atoms: covalent sp³ bonds that point to four neighbours. Ionic ones (large Δχ) prefer six neighbours, the rock salt of NaCl and MgO; heavy atoms (large n̄) tip the balance early. "
    + "Every semiconductor of electronics lives in the tetrahedral corner. Caveats: Pauling χ is a crude ionicity (Phillips' spectroscopic ionicity, with its critical value 0.785, separates them perfectly); ground states are PBE at 0 K; 'other' are distorted or layered structures.",
});