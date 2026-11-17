// The Ramachandran plot of four proteins: every residue's backbone angles
// φ and ψ (degrees), coloured by the secondary structure PDBe assigns it.
// Notice how little of the square is used: helix residues pile up near
// (−63°, −42°), strand residues near (−120°, +130°), and almost nothing
// sits at positive φ except glycines (rings): the side chain's Cβ clashes
// with the backbone there. Secondary structure is not a separate fact, it
// is where on this map a run of residues sits. Facets: all residues, and
// glycine/proline apart. Hover a residue; click it for the entry at PDBe.
const rows = Array.isArray(data) ? data : [];
const ssCol = {helix: "#ef4444", strand: "#3b82f6", loop: "#a1a1aa"};
const boxes = [
  {region: "α_R", x1: -160, x2: -20, y1: -120, y2: 50},
  {region: "β", x1: -180, x2: -90, y1: 50, y2: 180},
  {region: "PPII", x1: -90, x2: -20, y1: 50, y2: 180},
  {region: "α_L", x1: 20, x2: 120, y1: -60, y2: 100},
];
return plot({
  height: Math.max(440, (fit?.height ?? 520) - 20), marginRight: 20,
  fx: {domain: ["other 18 amino acids", "glycine", "proline"], label: null},
  x: {label: "φ (degrees) →", domain: [-180, 180], ticks: [-180, -90, 0, 90, 180], grid: true},
  y: {label: "↑ ψ (degrees)", domain: [-180, 180], ticks: [-180, -90, 0, 90, 180], grid: true},
  color: {domain: ["helix", "strand", "loop"], range: [ssCol.helix, ssCol.strand, ssCol.loop], legend: true, label: "secondary structure (PDBe)"},
  marks: [
    Plot.rect(["other 18 amino acids", "glycine", "proline"].flatMap(k => boxes.map(b => ({...b, kind: k}))),
      {fx: "kind", x1: "x1", x2: "x2", y1: "y1", y2: "y2", fill: "currentColor", fillOpacity: 0.04, stroke: "currentColor", strokeOpacity: 0.15}),
    Plot.text(boxes.map(b => ({...b, kind: "other 18 amino acids"})), {fx: "kind", x: d => (d.x1 + d.x2) / 2, y: "y2", text: "region", dy: 8, fontSize: 10, fillOpacity: 0.6}),
    Plot.ruleX([0], {stroke: "currentColor", strokeOpacity: 0.3}),
    Plot.dot(rows, {fx: "kind", x: "phi", y: "psi", fill: "ss", r: 2.4, fillOpacity: 0.75, href: "link", target: "_blank", tip: true,
      channels: {entry: "entry", protein: "protein", residue: d => `${d.res} ${d.author_num} (chain ${d.chain})`, region: "region", "MolProbity": "rama"}}),
  ],
  caption: "Boxes: approximate basins (α_R, β, PPII, α_L). Angles from PDBe's validation of 1A6M, 2LZM, 1UBQ and 1EMA.",
});