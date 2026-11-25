// How fast is it rising? Bars: NOAA's annual growth (ppb per year); line:
// the monthly growth rate (the trend's 12-month change). Beneath, ENSO
// (the Oceanic Niño Index): red El Niño, blue La Niña. The 2020–2022 surge
// coincided with a triple-dip La Niña (wetter tropical wetlands emit
// more) and with COVID lockdowns (less NOx, so less OH to destroy
// methane), but across 40 years ENSO alone tracks growth poorly: the
// strongest correlation is shown below the chart.
const s = data || {};
const H = Math.max(380, (fit?.height ?? 540) - 30);
const lag = s.best_lag || {};
return plot({
  height: H, marginLeft: 56,
  x: {label: null, tickFormat: (d) => String(d)},
  y: {label: "↑ growth (ppb per year)", grid: true, domain: [-6, 20]},
  color: {type: "diverging", scheme: "RdBu", reverse: true, domain: [-2.5, 2.5], legend: true, label: "ONI (°C): El Niño red, La Niña blue"},
  marks: [
    Plot.rectY(s.enso || [], {x1: (d) => d.t - 1 / 24, x2: (d) => d.t + 1 / 24, y1: -6, y2: -3.5, fill: "oni"}),
    Plot.text([{x: 1984, y: -4.75, t: "ENSO"}], {x: "x", y: "y", text: "t", textAnchor: "start", fontSize: 10, fill: "#fafafa"}),
    Plot.ruleY([0], {strokeOpacity: 0.4}),
    Plot.rectY(s.annual || [], {x1: "year", x2: (r) => r.year + 1, y: "growth", fill: "#a1a1aa", fillOpacity: 0.35, inset: 1, tip: true,
      channels: {year: "year", growth: (r) => `${r.growth} ± ${r.unc} ppb/yr`}}),
    Plot.line(s.monthly || [], {x: "t", y: "growth", stroke: "#fafafa", strokeWidth: 1.6}),
    Plot.tip(s.monthly || [], Plot.pointerX({x: "t", y: "growth", title: (r) => `${r.month}: ${r.growth.toFixed(1)} ppb/yr\nONI ${r.oni ?? "?"} (${r.phase} ${lag.lag} months earlier)`})),
  ],
  caption: `Bars: NOAA's annual increase. Line: monthly growth of the de-seasonalised trend. Growth minus its 7-year mean against ENSO: strongest correlation r = ${lag.r?.toFixed(2)} with ENSO ${lag.lag} months earlier (${lag.n} months): ENSO explains about ${(100 * lag.r ** 2).toFixed(0)}% of the year-to-year wobble.`,
});