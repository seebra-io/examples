// How much of the φ–ψ plane is used: 10° × 10° cells sorted from the
// fullest, against the cumulative share of residues they hold. If the
// residues were spread evenly the curve would be the diagonal; instead a
// few percent of the plane holds most of them. Hover a point for its cell.
const rows = Array.isArray(data) ? data : [];
const total = rows[0]?.total ?? 0;
const mark = [0.5, 0.8, 0.95].map(s => rows.find(d => d.cum_share >= s)).filter(Boolean);
return plot({
  height: Math.max(320, (fit?.height ?? 400) - 20),
  x: {label: "share of the φ–ψ plane (10° cells, fullest first) →", domain: [0, 0.3], tickFormat: "%", grid: true},
  y: {label: "↑ share of residues", domain: [0, 1], tickFormat: "%", grid: true},
  marks: [
    Plot.line([{x: 0, y: 0}, {x: 0.3, y: 0.3}], {x: "x", y: "y", stroke: "currentColor", strokeOpacity: 0.3, strokeDasharray: "4 3"}),
    Plot.line(rows, {x: "plane_share", y: "cum_share", stroke: "#8b5cf6"}),
    Plot.dot(rows, {x: "plane_share", y: "cum_share", r: 1.5, fill: "#8b5cf6", tip: true,
      channels: {cell: d => `φ ${d.cell_phi}…${d.cell_phi + 10}°, ψ ${d.cell_psi}…${d.cell_psi + 10}°`, residues: "n", helix: "helix", strand: "strand", glycines: "gly", rank: "rank"}}),
    Plot.text(mark, {x: "plane_share", y: "cum_share", text: d => `${Math.round(d.cum_share * 100)}% of residues in ${(d.plane_share * 100).toFixed(1)}% of the plane`, dx: 8, textAnchor: "start", fontSize: 11}),
  ],
  caption: `${total} residues of four proteins. Dashed: an even spread over the plane.`,
});