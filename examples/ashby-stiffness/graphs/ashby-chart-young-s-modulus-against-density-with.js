// Ashby chart: Young's modulus E against density ρ on log axes, every material from both Wikidata lists.
// data: indices {label, class, source, e_gpa, rho_kgm3, tie, beam, panel, rank_*, mass_vs_steel_*, k_gpa, g_gpa, nu, description, link}
const rows = (Array.isArray(data) ? data : []).filter(d => d.e_gpa > 0 && d.rho_kgm3 > 0);
const steel = rows.find(d => d.label === "steel") || {e_gpa: 210, rho_kgm3: 7850};
const [r0, r1] = [300, 25000];
// Through steel: a material on a line makes the same-stiffness part at the same mass as steel; above-left is lighter.
// E/ρ = const → E ∝ ρ (tie); E^½/ρ = const → E ∝ ρ² (beam); E^⅓/ρ = const → E ∝ ρ³ (panel).
const guides = [["tie: E/ρ = steel's", 1], ["beam: E^½/ρ = steel's", 2], ["panel: E^⅓/ρ = steel's", 3]].flatMap(([name, n]) =>
  d3.range(0, 41).map(i => {
    const rho = r0 * Math.pow(r1 / r0, i / 40);
    return {guide: name, rho, e: steel.e_gpa * Math.pow(rho / steel.rho_kgm3, n)};
  }).filter(p => p.e >= 0.05 && p.e <= 2000));
const named = new Set(["steel", "Aluminium 6061 T6 temper", "titanium", "magnesium", "beryllium", "white spruce wood", "AKROLOY PARA ICF 40",
  "diamond", "boron", "iron", "high-density polyethylene", "aluminium oxide", "osmium", "lithium", "polytetrafluoroethylene", "jarrah", "gold"]);
const short = s => s.replace("Aluminium 6061 T6 temper", "Al 6061-T6").replace("AKROLOY PARA ICF 40", "PARA + 40% carbon fibre")
  .replace("high-density polyethylene", "HDPE").replace("polytetrafluoroethylene", "PTFE").replace("white spruce wood", "white spruce");
const classes = ["metal", "element", "wood", "polymer", "composite", "ceramic or mineral"];
return plot({
  height: Math.max(460, (fit?.height ?? 560) - 40),
  x: {type: "log", label: "density ρ (kg/m³, log scale) →", domain: [r0, r1], grid: true, tickFormat: "~s"},
  y: {type: "log", label: "↑ Young's modulus E (GPa, log scale)", domain: [0.05, 2000], grid: true, tickFormat: "~g"},
  color: {domain: classes, legend: true, label: "material class"},
  symbol: {domain: ["E measured (P5480)", "E from K and G (P5668, P5673)"], range: ["circle", "triangle"], legend: true, label: "how E is known"},
  marks: [
    Plot.line(guides, {x: "rho", y: "e", z: "guide", stroke: "currentColor", strokeOpacity: 0.5, strokeDasharray: "5,3"}),
    Plot.text(guides, Plot.selectLast({x: "rho", y: "e", z: "guide", text: "guide", textAnchor: "end", dy: -6, fontSize: 10, fillOpacity: 0.75})),
    Plot.dot(rows, {x: "rho_kgm3", y: "e_gpa", stroke: "class", fill: d => d.source.startsWith("E measured") ? d.class : "none",
      symbol: "source", r: d => d.source.startsWith("E measured") ? 4.5 : 3, fillOpacity: 0.8, href: "link", target: "_blank", tip: true,
      channels: {material: "label", class: "class", "how E is known": "source", "E (GPa)": "e_gpa", "ρ (kg/m³)": "rho_kgm3",
        "E/ρ (MJ/kg)": "tie", "E^½/ρ": "beam", "E^⅓/ρ": "panel", "panel mass vs steel": "mass_vs_steel_panel",
        "rank as a panel": "rank_panel", "K (GPa)": "k_gpa", "G (GPa)": "g_gpa", "Poisson's ν": "nu", about: "description"}}),
    Plot.text(rows.filter(d => named.has(d.label) && !(d.label === "titanium" && d.source.startsWith("E from"))), {x: "rho_kgm3", y: "e_gpa", text: d => short(d.label), dx: 7, textAnchor: "start", fontSize: 10}),
  ],
  caption: "Each mark is a material on Wikidata (filled circles: Young's modulus as recorded; triangles: E = 9KG/(3K+G) from the bulk and shear moduli, mostly elements and minerals). "
    + "The dashed lines pass through steel: a material on a line gives a part of the same stiffness at the same mass as steel; above and to the left of it, lighter. "
    + "Read the three lines: on the slope-1 line (ties, E/ρ) steel, aluminium and titanium sit together; on the slope-3 line (panels, E^⅓/ρ) aluminium, magnesium, beryllium, carbon-fibre polyamide and above all spruce are far above steel. "
    + "Hover a material for its indices and rank; click it to open it on Wikidata. Caveat: a crowd-curated sample (about 30 engineering materials, a few hundred computed-looking element and mineral values without references).",
});
