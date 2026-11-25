// How were they spinning? The effective spin χ_eff is the spin along the
// orbit, mass-weighted: +1 both spinning fast with the orbit, −1 against
// it, 0 no spin (or spins in the plane). Pairs that grew up together as
// one binary star should have spins roughly aligned (χ_eff ≥ 0); pairs
// that met in a crowded cluster point any way, so as often negative as
// positive. Most black holes here spin slowly, the average leans positive,
// and unequal pairs (small q) tend to spin more, a trend no simple
// formation story predicts. Hover a merger.
const s = data || {};
const ev = (s.events || []).filter((e) => e.chi_eff != null && e.q != null);
return plot({
  height: Math.max(380, (fit?.height ?? 520) - 30), marginLeft: 56,
  x: {domain: [0, 1], label: "mass ratio q = m₂ / m₁ →  (1: equal masses)"},
  y: {domain: [-0.6, 0.8], label: "↑ effective spin χ_eff", grid: true},
  color: {domain: ["two black holes", "neutron star + black hole", "two neutron stars"], range: ["#60a5fa", "#f59e0b", "#ef4444"], legend: true},
  marks: [
    Plot.ruleY([0], {stroke: "currentColor", strokeOpacity: 0.5}),
    Plot.ruleX(ev, {x: "q", y1: "chi_lo", y2: "chi_hi", stroke: "kind", strokeOpacity: 0.2}),
    Plot.dot(ev, {x: "q", y: "chi_eff", fill: "kind", r: 3, tip: true, channels: {event: "name", "m₁ + m₂": (e) => `${e.m1} + ${e.m2} M☉`}}),
    Plot.linearRegressionY(ev.filter((e) => e.kind === "two black holes"), {x: "q", y: "chi_eff", stroke: "#fafafa", strokeDasharray: "5,4"}),
    Plot.text([{t: `mean χ_eff ${s.summary?.chi_mean?.toFixed(2)} · ${s.summary?.chi_negative} of ${s.summary?.chi_n} medians below 0`}], {frameAnchor: "top-right", text: "t", dx: -6, dy: 6, fontWeight: 600}),
  ],
  caption: "Medians with 90% intervals; most intervals include 0, so single events say little and the pattern is in the population. Dashed: least-squares line for black-hole pairs (medians only, a rough guide).",
});