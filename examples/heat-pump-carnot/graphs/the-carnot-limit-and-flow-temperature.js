// The Carnot limit for different flow temperatures, and half of it.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: fit?.height ?? 320,
  x: {label: "outdoor temperature (°C) →", grid: true},
  y: {label: "↑ COP", grid: true, domain: [0, 14]},
  color: {legend: true, scheme: "reds"},
  marks: [
    Plot.lineY(rows, {x: "outside_c", y: "cop_carnot", stroke: "flow", strokeDasharray: "4,3"}),
    Plot.lineY(rows, {x: "outside_c", y: "half_carnot", stroke: "flow", strokeWidth: 2, tip: true,
      channels: {"flow temperature": "flow", "outdoor (°C)": "outside_c", "Carnot COP": "cop_carnot", "35% of Carnot": "half_carnot"}}),
  ],
  caption: "Dashed: the Carnot limit; solid: 35% of it, about what these four houses reach. At 5 °C outside that is 5.2 with 25 °C water and 3.1 with 40 °C water. Radiator size and weather compensation (water only as warm as the day needs) decide the flow temperature, and with it the running cost.",
});