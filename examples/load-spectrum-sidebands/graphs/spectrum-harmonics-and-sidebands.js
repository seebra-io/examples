// The amplitude spectrum, 0–4.5 cycles/day, in dB, for the three variants; theory lines k ± j/7 as ticks.
const spec = Array.isArray(data[0]) ? data[0] : [];
const lines = Array.isArray(data[1]) ? data[1] : [];
return plot({
  height: fit?.height ?? 440,
  x: {label: "frequency (cycles per day) →", domain: [0, 4.5], ticks: d3.range(0, 4.6, 0.5)},
  y: {label: "↑ amplitude (dB re 1 GW)", grid: true, domain: [-45, 22]},
  fy: {label: null},
  color: {legend: true, domain: ["daily harmonic (carrier)", "sideband", "weekly harmonic"], range: ["#dc2626", "#f59e0b", "#7c3aed"]},
  marks: [
    Plot.ruleX(lines, {x: "f_cpd", stroke: "role", strokeOpacity: 0.35}),
    Plot.lineY(spec, {x: "f_cpd", y: "amplitude_db", fy: "variant", stroke: "currentColor", strokeWidth: 1}),
    Plot.tip(spec, Plot.pointerX({x: "f_cpd", y: "amplitude_db", fy: "variant",
      channels: {variant: "variant", "frequency (cpd)": "f_cpd", "period (h)": d => (24 / d.f_cpd).toFixed(2), "amplitude (GW)": "amplitude_gw", "dB": "amplitude_db"}})),
  ],
  caption: "Top (A, 8 whole weeks, no window): sharp lines at 1, 2, 3, 4 per day and, beside each, sidebands at k ± 1/7, 2/7, 3/7: the weekly envelope moved up to every daily harmonic (the modulation theorem). "
    + "B (Hann window): the same lines with the floor between them pushed down; the price is lines twice as wide. C (one week): the record is too short to separate lines 1/7 per day apart (resolution 1/T), so carrier and sidebands melt into one broad hump. Hover for the period in hours.",
});