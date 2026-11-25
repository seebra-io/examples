// Why is half the protein tolerant? Each residue's AlphaFold confidence
// (pLDDT) against the mean AlphaMissense score of its 19 possible changes.
// Residues AlphaFold can't place (pLDDT < 50) are disordered: no fold to
// break, so almost any change is predicted benign, and ClinVar's
// pathogenic changes (red rings) sit in the folded core. Disorder is not
// junk: p53's disordered ends carry its activation and its binding sites,
// whose damage AlphaMissense (and a fold) sees less of. Click a residue to
// show it in 3D.
const s = data || {};
const rows = (s.residues || []).filter((r) => r.plddt != null && r.am_mean != null);
const H = Math.max(380, (fit?.height ?? 520) - 20);
return plot({
  height: H, marginLeft: 54, marginRight: 140,
  x: {domain: [20, 100], label: "AlphaFold confidence (pLDDT) →"},
  y: {domain: [0, 1], label: "↑ mean AlphaMissense of the residue's changes", grid: true},
  color: {type: "sequential", scheme: "RdYlBu", reverse: true, domain: [0, 1], legend: true, label: "mean AlphaMissense"},
  marks: [
    Plot.rectY([{x1: 20, x2: 50}, {x1: 50, x2: 70}, {x1: 70, x2: 90}, {x1: 90, x2: 100}], {x1: "x1", x2: "x2", y1: 0, y2: 1, fill: ["#ff7d45", "#ffdb13", "#65cbf3", "#0053d6"], fillOpacity: 0.07}),
    Plot.dot(rows, {x: "plddt", y: "am_mean", fill: "am_mean", r: 3, tip: true,
      channels: {residue: (r) => `${r.aa}${r.pos}`, "ClinVar pathogenic": "clinvar_path", "carried in gnomAD": "gnomad"}}),
    Plot.dot(rows.filter((r) => r.clinvar_path), {x: "plddt", y: "am_mean", r: (r) => 3 + 1.5 * Math.sqrt(r.clinvar_path), stroke: "#ef4444", strokeWidth: 1.2}),
    Plot.text(s.by_confidence || [], {x: (b) => ({"very low (< 50)": 35, "low (50–70)": 60, "confident (70–90)": 80, "very high (≥ 90)": 95})[b.band], y: 0.02,
      text: (b) => `${b.residues} res.\n${b.mean_am == null ? "" : (100 * b.likely_pathogenic).toFixed(0) + "% LP"}\n${b.clinvar_pathogenic} ClinVar P`, fontSize: 10, lineAnchor: "bottom", fill: "currentColor", stroke: "#09090b", strokeWidth: 3}),
  ],
  caption: "Bands: AlphaFold's confidence classes. Red rings: residues with reviewed or unreviewed ClinVar pathogenic changes, larger for more.",
});