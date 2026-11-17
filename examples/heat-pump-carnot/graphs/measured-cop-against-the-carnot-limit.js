// Measured COP against the Carnot COP: one law for all houses.
const days = Array.isArray(data[0]) ? data[0] : [];
const f = (Array.isArray(data[1]) ? data[1] : [])[0];
const sys = ["Cheshire (underfloor + radiators)", "Angus (radiators)", "Newcastle (radiators)", "London (radiators)"];
return plot({
  height: fit?.height ?? 400,
  x: {label: "Carnot COP = T_flow / (T_flow − T_outdoor), kelvin →", grid: true, domain: [0, 30]},
  y: {label: "↑ measured COP", grid: true, domain: [0, 12]},
  color: {legend: true, domain: sys, range: ["#16a34a", "#2563eb", "#f59e0b", "#dc2626"]},
  marks: [
    Plot.line([[0, 0], [12, 12]], {stroke: "#a1a1aa", strokeDasharray: "2,3"}),
    Plot.text([[11, 12]], {text: () => "COP = Carnot (impossible above)", fontSize: 9, fill: "#71717a", textAnchor: "end", dy: -4}),
    Plot.dot(days, {x: "cop_carnot", y: "cop", fill: "system", r: 1.8, fillOpacity: 0.5, tip: true,
      channels: {day: "day", system: "system", "lift (K)": "lift_k", "share of Carnot": "carnot_fraction", "flow (°C)": "flow_c", "outdoor (°C)": "outside_c"}}),
    f ? Plot.line([[0, 0], [30, 30 * f.eta_through_origin]], {stroke: "#111827", strokeWidth: 2}) : null,
  ],
  caption: f ? `All ${f.days} days of the four houses fall around one line: COP ≈ ${f.eta_through_origin} × Carnot (r = ${f.r_carnot}). A heat pump is a Carnot cycle run backwards with real losses (heat exchangers need a few kelvin, the compressor is not ideal), so it delivers a roughly fixed share of what thermodynamics allows. `
    + `What it allows is set by the lift: each kelvin less between water and air is worth about ${Math.abs(f.cop_per_kelvin_lift)} in COP, so 5 K lower flow temperature gains about ${f.gain_5k_pct}% at a 25 K lift. The share falls at small lifts (cycling, defrost, fixed pump power): the right edge of the cloud.` : "",
});