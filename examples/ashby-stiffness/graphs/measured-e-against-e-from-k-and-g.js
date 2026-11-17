// The materials that have both a recorded Young's modulus and bulk/shear moduli: does E = 9KG/(3K+G) agree?
// data: crosscheck {label, e_measured_gpa, e_range_low, e_range_high, k_gpa, g_gpa, nu, e_from_kg_gpa, ratio, rho_kgm3, link}
const rows = Array.isArray(data) ? data : [];
const ext = d3.extent(rows.flatMap(d => [d.e_measured_gpa, d.e_from_kg_gpa, d.e_range_low, d.e_range_high]).filter(x => x > 0));
const lo = (ext[0] ?? 10) / 1.5, hi = (ext[1] ?? 500) * 1.5;
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 40),
  x: {type: "log", label: "Young's modulus recorded on Wikidata, P5480 (GPa) →", domain: [lo, hi], grid: true},
  y: {type: "log", label: "↑ E = 9KG/(3K+G) from Wikidata's K and G (GPa)", domain: [lo, hi], grid: true},
  marks: [
    Plot.line([[lo, lo], [hi, hi]], {stroke: "currentColor", strokeDasharray: "4,3", strokeOpacity: 0.6}),
    Plot.ruleY(rows, {x1: "e_range_low", x2: "e_range_high", y: "e_from_kg_gpa", stroke: "#f97316", strokeWidth: 2}),
    Plot.dot(rows, {x: "e_measured_gpa", y: "e_from_kg_gpa", fill: "#f97316", r: 5, href: "link", target: "_blank", tip: true,
      channels: {material: "label", "E recorded (GPa)": "e_measured_gpa", "E from K, G (GPa)": "e_from_kg_gpa", ratio: "ratio",
        "K (GPa)": "k_gpa", "G (GPa)": "g_gpa", "Poisson's ν": "nu"}}),
    Plot.text(rows, {x: "e_measured_gpa", y: "e_from_kg_gpa", text: d => `${d.label} (×${d.ratio})`, dx: 8, textAnchor: "start", fontSize: 11}),
  ],
  caption: "A check of the two lists against each other on the few materials in both (orange bars: the range of recorded E values). "
    + "On the dashed line the two agree. Isotropic elasticity ties the moduli together (E = 9KG/(3K+G)), so the gap is in the inputs: "
    + "Wikidata's K and G carry no reference and look like DFT values (identical numbers for all silica polymorphs, G > K for silica), which typically differ from handbook values by 10–30%. "
    + "Read the triangles on the Ashby chart with that error bar in mind.",
});
