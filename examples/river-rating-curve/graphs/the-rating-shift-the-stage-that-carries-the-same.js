// The rating shift: the stage each decade's own curve gives for 40,000, 100,000 and 300,000 ft³/s.
// data: fit_era {era, decade, stage_at_40k, stage_at_100k, stage_at_300k, b, e, measurements}
const rows = (Array.isArray(data) ? data : []).flatMap(d => [
  {decade: d.decade, era: d.era, flow: "40,000 ft³/s (low flow)", stage: d.stage_at_40k, b: d.b, e: d.e, n: d.measurements},
  {decade: d.decade, era: d.era, flow: "100,000 ft³/s", stage: d.stage_at_100k, b: d.b, e: d.e, n: d.measurements},
  {decade: d.decade, era: d.era, flow: "300,000 ft³/s (flood)", stage: d.stage_at_300k, b: d.b, e: d.e, n: d.measurements}]);
const lo = rows.filter(d => d.flow.startsWith("40,000"));
const peak = d3.greatest(lo, d => d.stage), last = lo[lo.length - 1];
return plot({
  height: Math.max(380, (fit?.height ?? 440) - 40),
  x: {label: "decade →", tickFormat: d => `${d}s`, type: "point"},
  y: {label: "↑ stage that carries this flow (ft)", grid: true},
  color: {legend: true, label: "flow"},
  marks: [
    Plot.line(rows, {x: "decade", y: "stage", stroke: "flow", strokeWidth: 2}),
    Plot.dot(rows, {x: "decade", y: "stage", fill: "flow", r: 4, tip: true,
      channels: {era: "era", "measurements in the decade": "n", "b": "b", "e (ft)": "e"}}),
  ],
  caption: `Each decade's measurements get their own curve; read off it the stage that carries the same flow. `
    + (peak && last ? `40,000 ft³/s ran at ${peak.stage} ft in the ${peak.era} and at ${last.stage} ft in the ${last.era}: the river bed at Hermann has cut down (sand dredging, and dams upstream that trap sediment), so the same water stands lower. ` : "")
    + "The flood curve moves far less: at high water the wide channel and floodplain, not the bed, set the stage. "
    + "That is why USGS keeps measuring (about 8 times a year here) and applies shifts to the rating between measurements. Caveat: each decade's e and b trade off against each other; the stage at a fixed flow is the robust comparison.",
});