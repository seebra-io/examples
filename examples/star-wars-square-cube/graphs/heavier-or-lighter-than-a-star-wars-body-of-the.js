// Who is unusually heavy or light for their height: mass over the mass the fitted law predicts for that height (log scale).
// data: odd {name, species, group, height_cm, mass_kg, bmi, expected_kg, heavier_by, vs_species_height, wiki}, sorted heaviest first
const rows = Array.isArray(data) ? data : [];
const shown = rows.length > 24 ? [...rows.slice(0, 12), ...rows.slice(-12)] : rows;
return plot({
  height: Math.max(460, 16 * shown.length + 70),
  marginLeft: 170,
  x: {type: "log", label: "mass ÷ mass predicted for that height (log scale) →", domain: [0.4, 25], grid: true},
  y: {label: null, domain: shown.map(d => d.name)},
  color: {domain: ["human", "alien", "droid"], range: ["#3b82f6", "#f97316", "#71717a"], legend: true, label: "who"},
  marks: [
    Plot.ruleX([1], {stroke: "currentColor"}),
    Plot.ruleY(shown, {y: "name", x1: 1, x2: "heavier_by", stroke: "group", strokeWidth: 2}),
    Plot.dot(shown, {y: "name", x: "heavier_by", fill: "group", r: 4, href: "wiki", target: "_blank", tip: true,
      channels: {species: "species", "height (cm)": "height_cm", "mass (kg)": "mass_kg", "predicted (kg)": "expected_kg", "BMI (kg/m²)": "bmi",
        "height ÷ species average": "vs_species_height"}}),
    Plot.text(shown, {y: "name", x: "heavier_by", text: d => `${d.mass_kg} kg at ${d.height_cm} cm`, dx: 8, textAnchor: "start", fontSize: 9, fill: "currentColor"}),
  ],
  caption: "The 12 heaviest and 12 lightest characters for their height, against the law fitted on everyone but Jabba. "
    + "Jabba the Hutt is 19 times the mass of a Star Wars body of his height (BMI 443): a gastropod, not a scaled biped, and the one point that bends the fit. "
    + "Among humans, Owen Lars and Darth Vader (armour included) sit heavy; Padmé, at 45 kg for 185 cm, is the lightest human of all: "
    + "these are fan-entered numbers, and a costume's or an actor's weight may be what was recorded. Click a name for Wookieepedia.",
});