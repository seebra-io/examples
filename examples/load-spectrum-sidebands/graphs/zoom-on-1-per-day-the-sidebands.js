// Zoom: the carrier at 1 per day and its weekly sidebands, linear amplitude.
const spec = (Array.isArray(data[0]) ? data[0] : []).filter(d => d.f_cpd >= 0.4 && d.f_cpd <= 1.6);
const lines = (Array.isArray(data[1]) ? data[1] : []).filter(d => d.f_cpd >= 0.4 && d.f_cpd <= 1.6);
return plot({
  height: fit?.height ?? 360,
  x: {label: "frequency (cycles per day) →", domain: [0.4, 1.6]},
  y: {label: "↑ amplitude (GW)", grid: true},
  color: {legend: true},
  marks: [
    Plot.ruleX(lines, {x: "f_cpd", stroke: "#a1a1aa", strokeDasharray: "2,3"}),
    Plot.text(lines, {x: "f_cpd", y: 0, text: "label", dy: 10, fontSize: 9, fill: "#71717a"}),
    Plot.lineY(spec, {x: "f_cpd", y: "amplitude_gw", stroke: "variant", strokeWidth: 1.5}),
    Plot.tip(spec, Plot.pointer({x: "f_cpd", y: "amplitude_gw", stroke: "variant",
      channels: {variant: "variant", "frequency (cpd)": "f_cpd", "period (h)": d => (24 / d.f_cpd).toFixed(2), "amplitude (GW)": "amplitude_gw"}})),
    Plot.ruleY([0]),
  ],
  caption: "Around the daily line: sidebands at 6/7 and 8/7 per day (periods of 28 h and 21 h), then 5/7 and 9/7. No machine and no person runs on a 21-hour cycle: these lines are not in the world, they are the weekday/weekend change of the daily cycle, seen in frequency. "
    + "The rectangular window's side lobes between the lines, and the single week's broad hump that cannot tell 6/7 from 1, show why spectral analysts choose the record length and the window first.",
});