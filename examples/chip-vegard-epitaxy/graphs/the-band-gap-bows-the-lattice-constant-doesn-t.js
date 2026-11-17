// Bowing: the alloys' band gap (and lattice constant) minus the straight line between the end points.
// data: vegard (only (Al,Ga)As has gaps in PBE)
const rows = (Array.isArray(data) ? data : []).filter(d => d.kind !== "binary");
const al = rows.filter(d => d.system === "(Al,Ga)As");
const b = al.length ? al[0].bow_gap_ev : null;
const curve = d3.range(0, 1.001, 0.02).map(x => ({x, y: -(b ?? 0) * x * (1 - x)}));
return plot({
  height: Math.max(300, (fit?.height ?? 360) - 20),
  x: {label: "x (Al share) →", domain: [0, 1], grid: true},
  y: {label: "↑ gap minus the straight line (eV, PBE)", grid: true},
  marks: [
    Plot.ruleY([0]),
    Plot.line(curve, {x: "x", y: "y", stroke: "#f97316", strokeDasharray: "4 3"}),
    Plot.dot(al, {x: "x", y: "de_ev", fill: "#f97316", r: 5, tip: true, href: "link", target: "_blank",
      channels: {cell: "formula", "space group": "sg", "gap (eV)": "gap_ev", "straight line (eV)": "e_linear", "bowing b (eV)": "bow_gap_ev"}}),
  ],
  caption: `(Al,Ga)As: the gap bends away from the straight line, fitted as −b·x(1−x) with b = ${b} eV (dashed), while the lattice constant does not bend (Vegard). `
    + "Caveats: ordered cells fold the X and L valleys onto Γ, so their gaps all look direct even where the random alloy is indirect (x above about 0.45); PBE gaps are too small; real alloys are random, not ordered.",
});