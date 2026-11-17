// Rarefaction: the species you'd expect in a random n of each province's records (Hurlbert's formula),
// with Chao1's estimate of the total (dashed, 95% interval as a band) at the right.
// data[0]: rarefaction {province, k, n, N, species}; data[1]: compare {province, records, species, chao1, chao1_lo, chao1_hi, common_n, species_at_common_n, ...}
const [curve, cmp] = data;
const provinces = ["Skåne", "Gotland", "Norrbotten"];
const common = cmp[0]?.common_n;
const xmax = d3.max(cmp, d => d.records);
return plot({
  height: Math.max(360, (fit?.height ?? 460) - 40),
  marginRight: 80,
  color: {domain: provinces, range: ["#f97316", "#38bdf8", "#a3e635"], legend: true},
  x: {label: "beetle records sampled at random (n) →", grid: true, tickFormat: "~s"},
  y: {label: "↑ species expected (rarefied) and Chao1's total", grid: true, tickFormat: "~s"},
  marks: [
    Plot.rect(cmp, {x1: d => d.records, x2: xmax * 1.04, y1: "chao1_lo", y2: "chao1_hi", fill: "province", fillOpacity: 0.12}),
    Plot.ruleY(cmp, {y: "chao1", x1: d => d.records, x2: xmax * 1.04, stroke: "province", strokeDasharray: "4,3"}),
    Plot.text(cmp, {y: "chao1", x: xmax * 1.04, text: d => `Chao1 ≈ ${d3.format(",")(d.chao1)}`, textAnchor: "start", dx: 4, fill: "province"}),
    Plot.ruleX([common], {stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "2,3"}),
    Plot.text([common], {x: d => d, frameAnchor: "top", dy: 4, dx: 4, textAnchor: "start", fillOpacity: 0.7,
      text: d => `at n = ${d3.format(",")(d)}: ` + cmp.map(c => `${c.province} ${Math.round(c.species_at_common_n)}`).join(", ")}),
    Plot.line(curve, {x: "n", y: "species", stroke: "province", strokeWidth: 2}),
    Plot.dot(curve, Plot.pointerX({x: "n", y: "species", fill: "province", r: 4, tip: true,
      channels: {"records in the province": "N"}, title: d => `${d.province}: ${d3.format(",")(d.species)} species expected in ${d3.format(",")(d.n)} random records (of ${d3.format(",")(d.N)})`})),
  ],
  caption: "Notice: every curve is still rising, so 'species recorded' mostly measures effort; compare provinces at the same n (dotted line), where the ranking can change. "
    + "Chao1 (from the species seen once and twice) is a lower bound on the total, not a census. "
    + "Caveats: rarefaction assumes records are a random sample, but GBIF records are clumped (one survey, one site, many records) and observers chase rare species; provinces differ in area and habitat too.",
});