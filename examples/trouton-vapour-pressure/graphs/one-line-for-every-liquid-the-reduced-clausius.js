// The reduced Clausius-Clapeyron plot. If ΔH_vap = Tb·ΔS is constant, every liquid obeys ln(P/P0) = -(ΔS/R)·(Tb/T - 1):
// on these axes all liquids fall on ONE straight line through the origin whose slope is set by ΔS alone.
// data[0]: compounds {name, x, y, hbond, ds_implied, p_pa, t_c, tb_c, plausible, wikidata, pubchem, ds_fit}
// data[1]: by_group {hbond, ds_median}
const [rows0, groups] = data;
const rows = (rows0 || []).filter(d => d.plausible);
const fitDs = rows.length ? rows[0].ds_fit : 99;
const R = 8.314462618, LN10 = Math.LN10;
const xmax = d3.max(rows, d => d.x) ?? 1;
const oh = (groups || []).find(g => g.hbond.startsWith("O–H"));
const laws = [
  {law: "Trouton: ΔS = 10.5 R = 87.3 J/(mol·K)", ds: Math.round(10.5 * R * 10) / 10, stroke: "#f97316", dash: null},
  {law: `best constant for non-donors: ΔS = ${fitDs} J/(mol·K)`, ds: fitDs, stroke: "#64748b", dash: "5,3"},
  ...(oh ? [{law: `O–H donors (median): ΔS = ${oh.ds_median} J/(mol·K)`, ds: oh.ds_median, stroke: "#dc2626", dash: "5,3"}] : []),
];
const seg = l => [{law: l.law, ds: l.ds, x: 0, y: 0}, {law: l.law, ds: l.ds, x: xmax, y: -l.ds / (R * LN10) * xmax}];
const classes = ["no H-bond donor", "N–H donor (amines, amides)", "O–H donor (alcohols, acids, water)"];
return plot({
  height: Math.max(420, (fit?.height ?? 500) - 40),
  x: {label: "Tb/T − 1 (how far below its normal boiling point the reading was taken) →", grid: true},
  y: {label: "↑ log₁₀(P / 1 atm), reported vapour pressure", grid: true},
  color: {domain: classes, range: ["#64748b", "#2563eb", "#dc2626"], legend: true, label: "hydrogen-bond donor (from SMILES)"},
  marks: [
    Plot.ruleX([0]), Plot.ruleY([0]),
    ...laws.map(l => Plot.line(seg(l), {x: "x", y: "y", stroke: l.stroke, strokeDasharray: l.dash, strokeWidth: 1.5, tip: true,
      channels: {law: "law", "ΔS (J/(mol·K))": "ds"}})),
    Plot.dot(rows, {x: "x", y: "y", fill: "hbond", r: 3, fillOpacity: 0.8, href: "wikidata", target: "_blank", tip: true,
      channels: {substance: "name", "boiling point (°C)": "tb_c", "reading at (°C)": "t_c", "vapour pressure (Pa)": "p_pa",
        "implied ΔS (J/(mol·K))": "ds_implied", "vs Trouton (log₁₀ ratio)": "log_ratio"}}),
    Plot.text(laws.map(l => seg(l)[1]), {x: "x", y: "y", text: "law", textAnchor: "end", dy: -6, fontSize: 10}),
  ],
  caption: "Each dot is one liquid's vapour pressure near room temperature, placed by how far it is below its own boiling point. Clausius–Clapeyron with a constant heat of vaporisation says they must all lie on one line through the origin whose slope is −ΔS/(R ln 10), "
    + "and Trouton's rule says ΔS is about the same (≈ 10.5 R) for every liquid: so the boiling point alone fixes the whole vapour-pressure curve. Notice the red O–H donors sitting below the line: hydrogen bonds order the liquid, so leaving it gains more entropy, and at the same distance below Tb they evaporate less. "
    + "The best constant for room-temperature readings is above 10.5 R because ΔH_vap grows as T falls below Tb. Hover a dot; click it for the substance on Wikidata.",
});