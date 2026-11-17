// The epitaxy map: band gap against lattice constant for the III-V binaries and Si, Ge
// (PBE), with the ordered alloys between them and the common substrates as vertical lines.
// data[0]: binaries {material, a_A, gap_ev, gap_type, link}; data[1]: series {system, x, a_A, gap_ev, kind}; data[2]: match
const [bins, series, match] = [data[0] || [], data[1] || [], data[2] || []];
const subs = bins.filter(d => ["Si", "GaAs", "InP"].includes(d.material));
const pbe = match.find(d => String(d.source).startsWith("PBE")) || {};
return plot({
  height: Math.max(400, (fit?.height ?? 480) - 20),
  x: {label: "lattice constant a (Å, PBE) →", grid: true},
  y: {label: "↑ band gap (eV, PBE)", grid: true},
  color: {domain: ["direct", "indirect", "no gap (PBE)"], range: ["#f97316", "#64748b", "#a1a1aa"], legend: true},
  marks: [
    Plot.ruleX(subs, {x: "a_A", stroke: "#0ea5e9", strokeDasharray: "4 3", strokeOpacity: 0.7}),
    Plot.text(subs, {x: "a_A", frameAnchor: "top", text: d => `${d.material} substrate`, rotate: -90, textAnchor: "end", dx: -6, dy: 4, fill: "#0ea5e9"}),
    Plot.line(series, {x: "a_A", y: "gap_ev", z: "system", sort: "x", stroke: "currentColor", strokeOpacity: 0.35}),
    Plot.dot(series.filter(d => d.kind !== "binary"), {x: "a_A", y: "gap_ev", r: 3, fill: "currentColor", fillOpacity: 0.5, tip: true, href: "link", target: "_blank",
      channels: {alloy: "system", x: "x", cell: "formula", "space group": "sg", "a (Å)": "a_A", "gap (eV)": "gap_ev"}}),
    Plot.dot(bins, {x: "a_A", y: "gap_ev", fill: "gap_type", r: 6, stroke: "white", tip: true, href: "link", target: "_blank",
      channels: {material: "material", "a (Å)": "a_A", "gap (eV)": "gap_ev", gap: "gap_type"}}),
    Plot.text(bins, {x: "a_A", y: "gap_ev", text: "material", dy: -12, fontSize: 10, fill: "currentColor"}),
  ],
  caption: `Every epitaxial stack is a vertical line on this map: films must share the substrate's lattice constant. GaAs and AlAs sit on almost the same line, so (Al,Ga)As layers of any composition grow on GaAs without strain (lasers, HEMTs). `
    + `InP's line crosses the (In,Ga)As series at x = ${pbe.x_ingaas_on_inp ?? "?"} with these PBE values (0.53 with measured ones): In0.53Ga0.47As, the photodetector of fibre optics. `
    + `Caveat: PBE gaps are too small (GaAs, InAs, InSb, GaSb come out near zero) and its lattice constants about 1–2% too large; the shape of the map is right, its numbers are not.`,
});