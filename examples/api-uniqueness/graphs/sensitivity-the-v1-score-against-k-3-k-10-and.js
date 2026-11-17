// Does the ranking depend on the formula's choices? The v1 score against the same score with k = 3, k = 10, and with place names kept.
// data: ranked {title, score_raw, score_k3, score_k10, score_kept, field, root, link}
const rows = Array.isArray(data) ? data : [];
const variants = [["score_k3", "k = 3 nearest"], ["score_k10", "k = 10 nearest"], ["score_kept", "place names kept"]];
const long = rows.flatMap(d => variants.map(([k, v]) => ({variant: v, v1: d.score_raw, other: d[k], title: d.title, field: d.field, link: d.link, shift: d[k] - d.score_raw})));
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 40),
  marginTop: 24,
  fx: {label: null, domain: variants.map(v => v[1])},
  x: {label: "v1 score (k = 5, place names removed) →", domain: [30, 100], grid: true},
  y: {label: "↑ score with the variant", domain: [30, 100], grid: true},
  color: {type: "diverging", scheme: "RdBu", domain: [-10, 10], legend: true, label: "variant − v1 (points)"},
  marks: [
    Plot.line([[30, 30], [100, 100]], {stroke: "currentColor", strokeDasharray: "4,3", strokeOpacity: 0.6}),
    Plot.dot(long, {fx: "variant", x: "v1", y: "other", r: 2, fill: "shift", fillOpacity: 0.85, href: "link", target: "_blank", tip: true,
      channels: {API: "title", field: "field", "change": d => d.shift.toFixed(1)}}),
  ],
  caption: "On the dashed line the variant agrees with v1. A larger k averages over farther neighbours, so every score rises (and a pair of twins weighs less); "
    + "k = 3 punishes having one twin. Keeping place names barely moves anything: the near-copies in this catalog are rarely the same thing for another country. "
    + "The table gives the rank correlations and how many of the top and bottom 50 stay there.",
});