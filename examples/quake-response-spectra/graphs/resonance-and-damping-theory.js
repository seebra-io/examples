// Theory: steady sine shaking of a damped oscillator.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: fit?.height ?? 340,
  x: {label: "β = natural period of the building / period of the shaking →", type: "log", domain: [0.05, 3.05]},
  y: {label: "↑ acceleration of the mass / acceleration of the ground", type: "log", grid: true},
  color: {legend: true, domain: ["2% damping", "5% damping", "20% damping"], range: ["#dc2626", "#2563eb", "#16a34a"]},
  marks: [
    Plot.ruleY([1], {stroke: "#a1a1aa"}), Plot.ruleX([1], {stroke: "#a1a1aa", strokeDasharray: "3,3"}),
    Plot.lineY(rows, {x: "beta", y: "amplification", stroke: "damping", strokeWidth: 2}),
    Plot.tip(rows, Plot.pointer({x: "beta", y: "amplification", stroke: "damping", channels: {damping: "damping", β: "beta", amplification: "amplification"}})),
  ],
  caption: "Shaken at its own period (β = 1), an oscillator with 5% damping moves ten times as much as the ground (1/2ζ); much stiffer (β ≪ 1) it just follows the ground; much softer (β ≫ 1) it stays still while the ground moves under it (base isolation). "
    + "A real earthquake is not a steady sine but a few seconds of broadband noise, so the measured SA/PGA peaks near 2–2.5, not 10: there is no time to build up resonance. Damping matters most exactly at resonance.",
});