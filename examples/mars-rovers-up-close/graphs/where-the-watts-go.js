// Parts whose power draw or output a source states, against the 110 W an MMRTG makes.
// data: parts with power_w {rover, part, kind, power_w, role}
const rows = (Array.isArray(data) ? data : []).filter(d => d.power_w != null).sort((a, b) => b.power_w - a.power_w);
const kinds = { camera: "#38bdf8", science: "#a3e635", power: "#fbbf24", sampling: "#f87171", comms: "#c084fc", computing: "#f472b6", thermal: "#fb923c", mobility: "#d4d4d8", helicopter: "#2dd4bf" };
const names = { sojourner: "Sojourner", mer: "Spirit & Opportunity", curiosity: "Curiosity", perseverance: "Perseverance" };
return plot({
  marginLeft: 210,
  marginTop: 28,
  height: Math.max(220, 34 * rows.length + 70),
  x: { label: "watts →", grid: true },
  y: { label: null, domain: rows.map(d => `${d.part} · ${names[d.rover]}`) },
  marks: [
    Plot.barX(rows, { y: d => `${d.part} · ${names[d.rover]}`, x: "power_w", fill: d => kinds[d.kind], tip: true,
      title: d => `${d.part} (${names[d.rover]}): ${d.power_w} W\n${d.role}` }),
    Plot.ruleX([110], { stroke: "#f97316", strokeDasharray: "4,3" }),
    Plot.text([110], { x: d => d, frameAnchor: "top", dy: -14, dx: 4, textAnchor: "start", text: () => "an MMRTG's 110 W", fill: "#f97316" }),
  ],
  caption: "MOXIE drew about 300 W and Ingenuity about 350 W in flight, both more than the MMRTG makes: MOXIE's hour-long runs leaned on the rover's batteries, Ingenuity flew on its own, solar-charged ones. Only parts with a stated figure are shown.",
});