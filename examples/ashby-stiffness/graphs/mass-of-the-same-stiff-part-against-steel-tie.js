// The same stiff part made of each candidate, relative to steel, as the design changes from a tie to a beam to a panel.
// data: slopes {label, class, source, link, e_gpa, rho_kgm3, design, step, idx, mass_vs_steel}
const rows = Array.isArray(data) ? data : [];
const designs = ["tie (E/ρ)", "beam (E^½/ρ)", "panel (E^⅓/ρ)"];
const last = rows.filter(d => d.step === 3);
const highlight = new Set(["steel", "Aluminium 6061 T6 temper", "titanium", "white spruce wood", "AKROLOY PARA ICF 40", "beryllium", "magnesium"]);
return plot({
  height: Math.max(420, (fit?.height ?? 520) - 40),
  marginRight: 170,
  x: {domain: designs, label: "what the part does (its performance index) →", padding: 0.2},
  y: {type: "log", label: "↑ mass of the part relative to steel (same stiffness; log scale, below 1 is lighter)", grid: true, tickFormat: "~g"},
  color: {domain: ["metal", "element", "wood", "polymer", "composite", "ceramic or mineral"], legend: true, label: "material class"},
  marks: [
    Plot.ruleY([1], {stroke: "currentColor", strokeDasharray: "4,3"}),
    Plot.line(rows, {x: "design", y: "mass_vs_steel", z: "label", stroke: "class", strokeWidth: d => highlight.has(d.label) ? 2.5 : 1, strokeOpacity: d => highlight.has(d.label) ? 0.95 : 0.4}),
    Plot.dot(rows, {x: "design", y: "mass_vs_steel", fill: "class", r: 3.5, href: "link", target: "_blank", tip: true,
      channels: {material: "label", design: "design", "mass vs steel": "mass_vs_steel", index: "idx", "E (GPa)": "e_gpa", "ρ (kg/m³)": "rho_kgm3", "how E is known": "source"}}),
    Plot.text(last, {x: "design", y: "mass_vs_steel", text: "label", dx: 8, textAnchor: "start", fontSize: 10, fill: "class"}),
  ],
  caption: "Mass of a part of the same stiffness and shape family, relative to steel (dashed line = steel). "
    + "Notice the lines fan out from left to right: for a tie (mass ∝ ρ/E) aluminium and titanium weigh about what steel does, but a panel's mass goes as ρ/E^⅓, "
    + "so a low density pays off nearly in full while low stiffness is forgiven: aluminium panels weigh about half of steel ones, spruce a sixth. That is why airframe skins are aluminium or carbon-fibre composite and early aircraft and gliders were spruce. "
    + "Hover a dot for the index and the material's E and ρ; click for Wikidata. Caveat: stiffness only (strength, fatigue, cost and how the part is joined are ignored); wood and fibre composites are stiff only along the grain or fibres.",
});
