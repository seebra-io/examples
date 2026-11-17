// Mass against landing year (log scale), sized by the power the rover has.
// Solar power (Sojourner, Spirit and Opportunity) depends on the sun and the dust;
// a plutonium RTG (Curiosity, Perseverance) gives about 110 W day and night.
// data: rovers {name, landed, mass_kg, peak_power_w, energy_per_sol_wh, power_source, battery}
const rows = (Array.isArray(data) ? data : []).map(d => ({ ...d, year: +String(d.landed).slice(0, 4) }));
return plot({
  height: Math.max(300, (fit?.height ?? 360) - 40),
  marginRight: 140,
  x: { label: "landed →", domain: [1994, 2024], tickFormat: "d" },
  y: { type: "log", label: "↑ mass (kg, log scale)", grid: true, domain: [5, 2000] },
  r: { range: [6, 26] },
  marks: [
    Plot.line(rows, { x: "year", y: "mass_kg", stroke: "currentColor", strokeOpacity: 0.25, strokeDasharray: "3,3" }),
    Plot.dot(rows, { x: "year", y: "mass_kg", r: "peak_power_w", fill: d => d.power_source.startsWith("Solar") ? "#fbbf24" : "#f97316", fillOpacity: 0.85, tip: true,
      title: d => `${d.name} (${d.landed})\n${d3.format(",")(d.mass_kg)} kg\n${d.power_source}\nabout ${d.peak_power_w} W` +
        (d.energy_per_sol_wh ? `, ~${d3.format(",")(d.energy_per_sol_wh)} Wh per sol` : "") + `\nbattery: ${d.battery}` }),
    Plot.text(rows, { x: "year", y: "mass_kg", text: d => `${d.name} · ${d.peak_power_w} W`, dx: 30, textAnchor: "start", fontSize: 11 }),
  ],
  caption: "Yellow: solar; orange: radioisotope (MMRTG). A hundred times the mass in 24 years, but power grew only sevenfold: the big rovers budget energy per sol, charging batteries for the peaks.",
});