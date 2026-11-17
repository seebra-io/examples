// The b-value as a function of the cut-off Mc, for each magnitude family: a stable b is a plateau.
// data: stability {family, mc, b, lo, hi, quakes}
const rows = Array.isArray(data) ? data : [];
return plot({
  height: Math.max(320, (fit?.height ?? 380) - 40),
  x: {label: "cut-off magnitude Mc →", grid: true},
  y: {label: "↑ b-value (Aki–Utsu), 95% interval", grid: true, domain: [0.4, 2.8]},
  color: {legend: true, domain: ["body-wave mb (and others)", "moment magnitude Mw"], range: ["#a1a1aa", "#38bdf8"]},
  marks: [
    Plot.ruleY([1], {stroke: "#f97316", strokeDasharray: "4,3"}),
    Plot.ruleX(rows, {x: d => d.mc + (d.family.startsWith("moment") ? 0.02 : -0.02), y1: "lo", y2: "hi", stroke: "family", strokeWidth: 2}),
    Plot.dot(rows, {x: d => d.mc + (d.family.startsWith("moment") ? 0.02 : -0.02), y: "b", fill: "family", r: 3, tip: true, channels: {Mc: "mc", b: "b", "± se": "b_se", quakes: "quakes"}}),
  ],
  caption: "Where does b settle? USGS reports most small quakes in body-wave magnitude mb and most large ones in moment magnitude Mw (mb saturates near 6), so the mb family lacks its large quakes (b far above 1) "
    + "and the Mw family lacks many of its small ones (b too low at small Mc). Read the Mw dots past Mc ≈ 5.5: with the scale that measures the fault's real size, b is close to 1 (orange). Hidden lesson: a b-value is a property of a catalogue and its magnitude scale as much as of the Earth.",
});