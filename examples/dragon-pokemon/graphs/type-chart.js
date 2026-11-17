// Dragon's type chart, read straight from PokeAPI's answer (damage_relations):
// six columns, one chip per type. Hover a chip for what it means in battle.
const relations = [
  ["double_damage_to", "Dragon hits 2×"], ["half_damage_to", "Dragon does ½×"], ["no_damage_to", "Dragon does 0×"],
  ["double_damage_from", "hurts Dragon 2×"], ["half_damage_from", "Dragon resists ½×"], ["no_damage_from", "Dragon is immune"]];
const typeColor = {normal: "#a8a77a", fire: "#ee8130", water: "#6390f0", electric: "#f7d02c", grass: "#7ac74c", ice: "#96d9d6",
  fighting: "#c22e28", poison: "#a33ea1", ground: "#e2bf65", flying: "#a98ff3", psychic: "#f95587", bug: "#a6b91a", rock: "#b6a136",
  ghost: "#735797", dragon: "#6f35fc", dark: "#705746", steel: "#b7b7ce", fairy: "#d685ad", none: "#3f3f46"};
const chips = relations.flatMap(([key, label]) => {
  const types = data?.damage_relations?.[key] ?? [];
  return (types.length ? types : [{name: "none"}]).map((t, i) => ({relation: label, type: t.name, row: i}));
});
return plot({
  color: false,
  marginLeft: 8, marginTop: 28,
  x: {domain: relations.map((r) => r[1]), axis: "top", label: null, tickSize: 0},
  y: {axis: null, domain: d3.range(Math.max(4, d3.max(chips, (d) => d.row) + 1))},
  marks: [
    Plot.cell(chips, {x: "relation", y: "row", fill: (d) => typeColor[d.type] ?? "#71717a", inset: 3, rx: 8,
      title: (d) => d.type === "none" ? `${d.relation}: no type` : `${d.type}: ${d.relation}`, tip: true}),
    Plot.text(chips, {x: "relation", y: "row", text: "type", fill: "#09090b", fontWeight: 600}),
  ],
});