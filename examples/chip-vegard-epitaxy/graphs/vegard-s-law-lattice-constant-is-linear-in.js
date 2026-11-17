// Vegard's law: lattice constant against composition, with the substrate lines.
// data[0]: vegard {system, kind, x, a_A, a_vegard, da_A, bow_a_A, max_dev_pct}; data[1]: binaries
const [rows, bins] = [data[0] || [], data[1] || []];
const sub = Object.fromEntries(bins.map(d => [d.material, d.a_A]));
const ends = [...new Set(rows.map(d => d.system))].map(s => { const r = rows.filter(d => d.system === s); return {system: s, pts: [[0, r[0].a_vegard ?? r[0].a_A], [1, r.find(d => d.x === 1)?.a_A]] , bow: r[0].bow_a_A, dev: r[0].max_dev_pct}; });
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 20),
  x: {label: "x: In or Al share of the metal sites →", domain: [0, 1], grid: true},
  y: {label: "↑ lattice constant (Å, PBE; ordered cells: (8V/atoms)^(1/3))", grid: true},
  color: {legend: true},
  marks: [
    ...ends.map(e => Plot.line(e.pts, {stroke: () => e.system, strokeDasharray: "4 3", strokeOpacity: 0.7})),
    Plot.ruleY([sub["InP"]], {stroke: "#0ea5e9", strokeOpacity: 0.6}),
    Plot.text([sub["InP"]], {y: d => d, frameAnchor: "left", text: () => "InP substrate", dy: -6, fill: "#0ea5e9"}),
    Plot.dot(rows, {x: "x", y: "a_A", fill: "system", symbol: "kind", r: 5, tip: true, href: "link", target: "_blank",
      channels: {cell: "formula", "space group": "sg", "Vegard (Å)": "a_vegard", "off the line (Å)": "da_A", "bowing b_a (Å)": "bow_a_A", "largest deviation (%)": "max_dev_pct"}}),
  ],
  caption: "Dashed: Vegard's straight line between the binaries. The ordered alloys sit on it to within a few hundredths of a percent, so the composition sets the lattice constant and lattice matching is a linear equation. "
    + "(Al,Ga)As is nearly flat: Al and Ga atoms are almost the same size. Hover a point for its cell and its deviation.",
});