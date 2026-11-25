// Forty years of methane in the global air: monthly means from NOAA's
// marine surface sites (thin, with the seasonal swing: the OH that destroys
// methane peaks in each hemisphere's summer) and the de-seasonalised trend
// (thick). Read the trend's slope, era by era: a steady rise, a puzzling
// pause from 2000 to 2006, a renewed rise from 2007 and the record surge
// of 2020–2022. Hover for the month.
const s = data || {};
const eras = s.eras || [];
const col = ["#a1a1aa", "#60a5fa", "#f59e0b", "#ef4444", "#a78bfa"];
return plot({
  height: Math.max(360, (fit?.height ?? 520) - 30), marginLeft: 56,
  x: {label: null, tickFormat: (d) => String(d)},
  y: {label: "↑ CH₄ (parts per billion)", grid: true},
  marks: [
    Plot.rect(eras, {x1: (e) => e.from, x2: (e) => e.to + 1, y1: () => 1600, y2: () => 1960, fill: (e, i) => col[i], fillOpacity: 0.07}),
    Plot.text(eras, {x: (e) => (e.from + e.to + 1) / 2, y: (e, i) => i % 2 ? 1930 : 1955, text: (e) => `${e.era}\n${e.growth.toFixed(1)} ppb/yr`, fill: (e, i) => col[i], fontSize: 11, fontWeight: 600, lineAnchor: "top"}),
    Plot.line(s.series || [], {x: "t", y: "ppb", stroke: "#60a5fa", strokeOpacity: 0.5}),
    Plot.line(s.series || [], {x: "t", y: "trend", stroke: "#fafafa", strokeWidth: 2.2}),
    Plot.tip(s.series || [], Plot.pointerX({x: "t", y: "trend", title: (r) => `${r.month}\nmonthly mean ${r.ppb.toFixed(1)} ppb\ntrend ${r.trend?.toFixed(1)} ppb`})),
  ],
  caption: `NOAA Global Monitoring Laboratory, globally averaged marine surface monthly means (Lan et al.), through ${s.latest?.month}: ${s.latest?.ppb.toFixed(0)} ppb, about 2.7 times the pre-industrial 722 ppb.`,
});