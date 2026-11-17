// Fifty years of microprocessors on one log scale (Karl Rupp's data), each measure
// with its own least-squares line before and after the break year the clock data chose.
// data[0]: points {series, measure, unit, year, value, link}
// data[1]: eras {series, era, brk, slope, intercept, doubling_years, growth_pct, r2, year_from, year_to}
const [pts, eras] = [data[0] || [], data[1] || []];
const brk = eras.length ? eras[0].brk : 2005;
const order = ["transistors", "single-thread", "frequency", "power", "cores"];
const colors = ["#f97316", "#a855f7", "#0ea5e9", "#ef4444", "#22c55e"];
const lines = eras.flatMap(e => [e.year_from, e.year_to].map(x => ({...e, x, y: Math.pow(2, e.intercept + e.slope * x)})));
const label = e => `${e.measure}, ${e.era}: ${e.doubling_years > 0 && e.doubling_years < 100 ? "doubles every " + e.doubling_years + " years" : "no doubling (" + e.growth_pct + "%/year)"} (${e.growth_pct > 0 ? "+" : ""}${e.growth_pct}%/year, r² = ${e.r2}, n = ${e.n})`;
return plot({
  height: Math.max(420, (fit?.height ?? 520) - 30),
  marginRight: 20,
  x: {label: "year of introduction →", tickFormat: "d", grid: true},
  y: {type: "log", label: "↑ value (log scale; each measure in its own unit: see the legend)", grid: true, tickFormat: "~s"},
  color: {domain: order, range: colors, legend: true,
    tickFormat: s => ({transistors: "transistors (thousands)", "single-thread": "single-thread perf. (SpecINT×10³)", frequency: "clock (MHz)", power: "power (W)", cores: "logical cores"})[s]},
  marks: [
    Plot.ruleX([brk], {stroke: "currentColor", strokeDasharray: "4 3", strokeOpacity: 0.6}),
    Plot.text([brk], {x: d => d, frameAnchor: "top", dy: 4, dx: 4, textAnchor: "start", text: d => `break: ${d} (best fit for the clock)`, fill: "currentColor", fillOpacity: 0.7}),
    Plot.dot(pts, {x: "year", y: "value", stroke: "series", r: 2.5, strokeOpacity: 0.75, href: "link", target: "_blank", tip: true,
      channels: {processor: d => d.processor || "(digitised, unnamed)", measure: "measure", year: d => d.year.toFixed(1), value: "value", unit: "unit"}}),
    Plot.line(lines, {x: "x", y: "y", z: d => d.series + d.era, stroke: "series", strokeWidth: 2.5, tip: true, title: label}),
  ],
  caption: `Dots: processors (click one for the source). Lines: a constant doubling time fitted before and after ${brk}. `
    + `Notice that the transistor line hardly bends at ${brk}, while clock and power go flat: transistors kept doubling but could no longer be clocked faster without melting the chip, `
    + `and single-thread performance slowed with the clock; the cores took over. Caveat: the points before 2010 were digitised from a published plot (Horowitz et al.), not read from data sheets; "power" is typical TDP.`,
});