// The same three records, HRV computed from every beat against normal-to-normal only.
// data: hrv_long {record, label, metric, series, value, n}
const rows = Array.isArray(data) ? data : [];
const all = rows.filter(d => d.series === "every beat"), nn = rows.filter(d => d.series === "normal-to-normal only");
return plot({
  height: Math.max(340, (fit?.height ?? 380) - 40),
  marginTop: 24,
  fx: {label: null, domain: ["SDNN (ms)", "RMSSD (ms)", "pNN50 (%)"]},
  x: {label: null, domain: [...new Set(rows.map(d => d.record))], padding: 0.2},
  y: {label: "↑ value (ms, or % for pNN50; square-root scale)", grid: true, type: "sqrt"},
  color: {domain: ["every beat", "normal-to-normal only"], range: ["#dc2626", "#2563eb"], legend: true},
  marks: [
    Plot.barY(all, {fx: "metric", x: "record", y: "value", fill: "series", fillOpacity: 0.35, tip: true,
      channels: {rhythm: "label", "intervals used": "n"}}),
    Plot.barY(nn, {fx: "metric", x: "record", y: "value", fill: "series", insetLeft: 8, insetRight: 8, tip: true,
      channels: {rhythm: "label", "intervals used": "n"}}),
    Plot.ruleY([0]),
  ],
  caption: "Pale red: computed from every consecutive pair of beats; blue: from normal-to-normal intervals only (the standard). "
    + "For the healthy record the two agree. For 119 the premature beats inflate RMSSD and pNN50 many times over (hover the bars): a naive HRV monitor would call this heart superbly vagal when it is in bigeminy. "
    + "Caveat: 15-minute windows (SDNN grows with window length: compare only like with like), annotations by cardiologists, not a beat detector.",
});