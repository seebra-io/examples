// Dragon Pokémon per generation, Dragon as first (primary) or second type.
// Hover a bar for its count; the share chart beside divides by the generation's size.
return plot({
  x: {label: "generation (Gen 1 = 1996, Gen 9 = 2022)", tickFormat: (g) => `Gen ${g}`},
  y: {label: "Dragon Pokémon (species)", grid: true},
  color: {domain: ["primary", "secondary"], range: ["#6f35fc", "#a78bfa"], label: "Dragon as"},
  marks: [
    Plot.barY(data, Plot.groupX({y: "count", title: (names) => names.join(", ")},
      {x: "generation", fill: "dragon_as", title: "name", tip: true})),
    Plot.ruleY([0]),
  ],
});