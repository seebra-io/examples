// The 15 most and 15 least unique APIs: their score, and the nearest other API with its cosine similarity.
// data: extremes {side, title, score, percentile, distinct, rarity, field, crowd, nearest_1, similarity_1, nearest_2, nearest_3, link}
const rows = Array.isArray(data) ? data : [];
const order = rows.map(d => d.title);
return plot({
  height: Math.max(560, 16 * rows.length + 80),
  marginLeft: 230, marginRight: 260,
  fy: {label: null, domain: ["most unique", "least unique"]},
  x: {label: "uniqueness score →", domain: [0, 100], grid: true},
  y: {label: null, domain: order, tickFormat: t => t.length > 34 ? t.slice(0, 33) + "…" : t},
  color: {type: "linear", domain: [0, 0.7], scheme: "oranges", legend: true, label: "similarity to its nearest API (cosine)"},
  marks: [
    Plot.barX(rows, {fy: "side", y: "title", x: "score", fill: "similarity_1", href: "link", target: "_blank", tip: true,
      channels: {percentile: "percentile", distinct: "distinct", rarity: "rarity", field: "field", "others in field": "crowd",
        "nearest": "nearest_1", "2nd": "nearest_2", "3rd": "nearest_3"}}),
    Plot.text(rows, {fy: "side", y: "title", x: "score", dx: 6, textAnchor: "start", fill: "currentColor",
      text: d => `${d.score} · nearest: ${d.nearest_1.length > 30 ? d.nearest_1.slice(0, 29) + "…" : d.nearest_1} (${d.similarity_1.toFixed(2)})`}),
    Plot.ruleX([0]),
  ],
  caption: "Top: alone in their category and in their words (nearest similarity ≈ 0.1). Bottom: product lines described from one template "
    + "(SportsData.io's v3 feeds, the EPA ECHO acts) and members of crowded science fields. Click a bar for the API's Explore page; "
    + "a low score is not a bad API, only one with close relatives in the catalog.",
});