// Die yield against die area under three defect models, with the real dies on the Poisson curve.
// data[0]: curves {area_mm2, d0, poisson, murphy, negbin}; data[1]: yields {name, kind, area_mm2, d0, y_poisson, y_murphy, y_negbin, dies_per_wafer, node, maker, link}
const [curves, dies] = [data[0] || [], data[1] || []];
const long = curves.flatMap(c => [["Poisson", c.poisson], ["Murphy", c.murphy], ["neg. binomial α=3", c.negbin]].map(([model, y]) => ({area_mm2: c.area_mm2, d0: c.d0, model, y})));
const fmt = d => `${d} defects/cm²`;
return plot({
  height: Math.max(420, (fit?.height ?? 500) - 20),
  marginTop: 24,
  fx: {label: null, tickFormat: fmt},
  x: {label: "die area (mm²) →", grid: true},
  y: {label: "↑ share of dies that work", tickFormat: "%", domain: [0, 1], grid: true},
  color: {legend: true, domain: ["Poisson", "Murphy", "neg. binomial α=3", "logic chip", "image sensor"], range: ["#0ea5e9", "#a855f7", "#22c55e", "#f97316", "#64748b"]},
  marks: [
    Plot.line(long, {fx: "d0", x: "area_mm2", y: "y", stroke: "model", strokeWidth: 1.5}),
    Plot.dot(dies, {fx: "d0", x: "area_mm2", y: "y_poisson", fill: "kind", r: 3.5, href: "link", target: "_blank", tip: true,
      channels: {chip: "name", kind: "kind", "area (mm²)": "area_mm2", "dies per 300 mm wafer": "dies_per_wafer", "Poisson yield": d => (100 * d.y_poisson).toFixed(1) + "%", "Murphy": d => (100 * d.y_murphy).toFixed(1) + "%", "neg. binomial": d => (100 * d.y_negbin).toFixed(1) + "%", process: "node", maker: "maker", released: "released"}}),
  ],
  caption: "Each panel is one defect density (a scenario: about 0.1/cm² for a mature process, 0.5 for a young one). Dots: real dies from Wikidata on the Poisson curve; click one for its article. "
    + "Notice the yield falls exponentially with area: at 0.5 defects/cm² a phone SoC of 90 mm² still yields about 64%, a 430 mm² laptop chip about 12%. Clustered defects (Murphy, negative binomial) are kinder to big dies, but the shape is the same.",
});