// Silicon cost per good mm², relative to an ideal die (no edge loss, perfect yield), per real die.
// data: yields
const rows = Array.isArray(data) ? data : [];
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 20),
  x: {label: "die area (mm²) →", grid: true},
  y: {label: "↑ cost of a good mm² (× ideal, log scale)", type: "log", grid: true},
  color: {legend: true, type: "ordinal", scheme: "Oranges", label: "defects per cm²"},
  marks: [
    Plot.ruleY([1]),
    Plot.line(rows, {x: "area_mm2", y: "cost_index", stroke: "d0", z: "d0", strokeOpacity: 0.6}),
    Plot.dot(rows, {x: "area_mm2", y: "cost_index", fill: "d0", symbol: "kind", r: 3.5, href: "link", target: "_blank", tip: true,
      channels: {chip: "name", kind: "kind", "dies per wafer": "dies_per_wafer", "yield (Poisson)": d => (100 * d.y_poisson).toFixed(1) + "%", "wafers per 1000 good": d => d.wafers_per_1000_good.toFixed(1)}}),
  ],
  caption: "The price of a wafer is fixed, so a good mm² of a big die costs more: fewer dies fit (edge loss) and fewer of them work. Small dies sit near 1 at every defect density; "
    + "an 860 mm² full-frame sensor costs several times the ideal at 0.1/cm² and far more on a young process. That is why big dies arrive late on a new node, why GPUs and sensors carry spare units, and why chiplets exist.",
});