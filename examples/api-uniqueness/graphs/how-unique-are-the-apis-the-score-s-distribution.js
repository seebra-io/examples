// The v1 score of every API (k = 5, place names removed), stacked by top-level field; the 8 largest fields get a colour, the rest are grey.
// data: ranked {id, title, score, score_raw, percentile, distinct, rarity, field, crowd, root, nearest_1, similarity_1, link}
const rows = Array.isArray(data) ? data : [];
const big = d3.groupSort(rows, g => -g.length, d => d.root).slice(0, 8);
const group = d => big.includes(d.root) ? d.root : "other fields";
const median = d3.median(rows, d => d.score_raw);
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 40),
  marginTop: 24,
  x: {label: "uniqueness score (v1: 100 × distinct × rarity) →", domain: [30, 100], grid: true},
  y: {label: "↑ APIs", grid: true},
  color: {domain: [...big, "other fields"], range: [...d3.schemeTableau10.slice(0, 8), "#a1a1aa"], legend: true, label: "top-level field"},
  marks: [
    Plot.rectY(rows, Plot.binX({y: "count", title: g => `${g.length} APIs, e.g. ${g.slice(0, 4).map(d => d.title).join(", ")}`},
      {x: "score_raw", fill: group, thresholds: d3.range(30, 101, 2.5), tip: true})),
    Plot.ruleX([median], {stroke: "currentColor", strokeDasharray: "4,3"}),
    Plot.text([median], {x: d => d, frameAnchor: "top", dy: -14, text: d => `median ${d.toFixed(0)}`}),
    // the APIs themselves, one tick each under the bars: hover for the record, click for its Explore page
    Plot.tickX(rows, {x: "score_raw", y: 0, dy: 8, stroke: group, strokeOpacity: 0.6, href: "link", target: "_blank", tip: true,
      channels: {API: "title", score: "score", percentile: "percentile", distinct: "distinct", rarity: "rarity", field: "field", "others in field": "crowd", nearest: "nearest_1", "its similarity": "similarity_1"}}),
    Plot.ruleY([0]),
  ],
  caption: "Each tick under the bars is one API (hover for its record, click for its Explore page). The left tail is the crowded fields "
    + "(science and engineering categories with 20–30 APIs, rarity ≈ 0.75) and the vendor families whose descriptions are near-copies; "
    + "the right tail is APIs alone in their category with words no other API uses. Caveat: the score reads the catalog's descriptions, not the data.",
});