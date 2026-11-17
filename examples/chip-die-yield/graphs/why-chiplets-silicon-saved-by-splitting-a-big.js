// Chiplets: one large die against the same design as 2, 4 or 8 tested smaller dies.
// data: chiplets {name, area_mm2, d0, n, die_mm2, die_yield, wafer_share, saving}
const rows = (Array.isArray(data) ? data : []).filter(d => d.kind === "logic chip");
const names = [...new Set(rows.map(d => `${d.name} (${d.area_mm2} mm²)`))];
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 20),
  marginTop: 24,
  fx: {label: null, tickFormat: d => `${d} defects/cm²`},
  x: {label: "number of chiplets n →", type: "log", ticks: [1, 2, 4, 8], tickFormat: "d"},
  y: {label: "↑ silicon saved against one die", tickFormat: "%", grid: true},
  color: {legend: names.length <= 10, domain: names},
  marks: [
    Plot.ruleY([0]),
    Plot.line(rows, {fx: "d0", x: "n", y: "saving", stroke: d => `${d.name} (${d.area_mm2} mm²)`, strokeOpacity: 0.7}),
    Plot.dot(rows, {fx: "d0", x: "n", y: "saving", fill: d => `${d.name} (${d.area_mm2} mm²)`, r: 3, href: "link", target: "_blank", tip: true,
      channels: {chip: "name", "die (mm²)": "area_mm2", "chiplet (mm²)": "die_mm2", "chiplet yield": d => (100 * d.die_yield).toFixed(1) + "%", "wafer share per chip": d => d.wafer_share.toFixed(4)}}),
  ],
  caption: "Each chiplet is 10% larger than its share for the die-to-die interface, and only tested-good chiplets are packaged. Splitting pays most for the largest dies on an immature process, and hardly at all for small dies on a mature one (the 10% overhead can make it a loss). "
    + "Caveats: packaging, test and interconnect costs and their own yield are left out; real chiplet designs also mix nodes (cheap I/O dies on older processes).",
});