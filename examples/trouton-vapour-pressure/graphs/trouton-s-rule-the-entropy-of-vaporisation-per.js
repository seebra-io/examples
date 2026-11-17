// The entropy of vaporisation each reading implies, ΔS = R ln(P0/P)/(Tb/T − 1), per class of liquid, against Trouton's 10.5 R.
// data[0]: compounds; data[1]: by_group {hbond, liquids, ds_median, ds_q25, ds_q75}
const [rows0, groups] = data;
const rows = (rows0 || []).filter(d => d.plausible);
const classes = ["no H-bond donor", "N–H donor (amines, amides)", "O–H donor (alcohols, acids, water)"];
const label = h => { const g = (groups || []).find(g => g.hbond === h); return g ? `${h}: n = ${g.liquids}, median ${g.ds_median} J/(mol·K) = ${g.ds_median_over_r} R` : h; };
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 40),
  marginLeft: 20,
  fy: {domain: classes, label: null, tickFormat: label, axis: null},
  x: {label: "implied entropy of vaporisation ΔS (J/(mol·K)) →", domain: [50, 200], grid: true},
  color: {domain: classes, range: ["#64748b", "#2563eb", "#dc2626"]},
  marks: [
    // each facet's label in its top-left corner (a vertical facet axis can't sit on top)
    Plot.text(classes, {fy: d => d, text: label, frameAnchor: "top-left", dx: 4, dy: 2, fontWeight: "bold", lineWidth: 90, stroke: "var(--plot-background)", strokeWidth: 3, paintOrder: "stroke"}),
    Plot.ruleX([10.5 * 8.314462618], {stroke: "#f97316", strokeWidth: 2}),
    Plot.rectY(rows, Plot.binX({y: "count"}, {fy: "hbond", x: "ds_implied", fill: "hbond", fillOpacity: 0.35, thresholds: d3.range(50, 205, 5)})),
    Plot.dot(rows, Plot.dodgeY({fy: "hbond", x: "ds_implied", fill: "hbond", r: 2.5, anchor: "bottom", href: "pubchem", target: "_blank", tip: true,
      channels: {substance: "name", "boiling point (°C)": "tb_c", "reading at (°C)": "t_c", "ΔS/R": "ds_over_r", SMILES: "smiles"}})),
    Plot.ruleX(groups || [], {fy: "hbond", x: "ds_median", stroke: "currentColor", strokeDasharray: "3,2"}),
    Plot.link(groups || [], {fy: "hbond", x1: "ds_q25", x2: "ds_q75", y: 0, stroke: "currentColor", strokeWidth: 4, tip: true,
      channels: {"25th percentile": "ds_q25", median: "ds_median", "75th percentile": "ds_q75", liquids: "liquids"}}),
  ],
  caption: "Orange: Trouton's rule, 10.5 R ≈ 87 J/(mol·K). Dashed: each class's median, the thick bar its middle half. Non-donor liquids cluster; O–H donors (water, alcohols, acids) sit to the right: their liquid is held in order by hydrogen bonds, so evaporating it gains more entropy. "
    + "All values sit somewhat above 87 because these readings are taken far below Tb, where ΔH_vap is larger (the Kistiakowsky and Watson corrections). Hover a dot; click it for the compound on PubChem.",
});