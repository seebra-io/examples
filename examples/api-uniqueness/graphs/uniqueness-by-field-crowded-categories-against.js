// Every category with at least 3 APIs: the mean score of its APIs against how many there are; colour is the top-level field.
// data: fields {category, root, apis, mean_score, mean_distinct, median_score, min_score, max_score, most_unique, least_unique, least_unique_nearest, least_unique_similarity, place_effect}
const rows = (Array.isArray(data) ? data : []).filter(d => d.apis >= 3);
const big = d3.groupSort(rows, g => -d3.sum(g, d => d.apis), d => d.root).slice(0, 9);
const group = d => big.includes(d.root) ? d.root : "other";
return plot({
  height: Math.max(420, (fit?.height ?? 480) - 40),
  marginRight: 20,
  x: {type: "log", label: "APIs in the category (log scale) →", grid: true},
  y: {label: "↑ mean uniqueness score of its APIs", grid: true},
  r: {range: [3, 12]},
  color: {domain: [...big, "other"], range: [...d3.schemeTableau10.slice(0, 9), "#a1a1aa"], legend: true, label: "top-level field"},
  marks: [
    // the score's rarity ceiling: an API with distinct = 1 in a category of n APIs scores 100 (1 - (n-1)/(2(n+19)))
    Plot.line(d3.range(1, 31, 0.5).map(n => ({n, s: 100 * (1 - (n - 1) / (2 * (n - 1 + 20)))})), {x: "n", y: "s", stroke: "currentColor", strokeDasharray: "4,3", strokeOpacity: 0.6}),
    Plot.ruleX(rows, {x: "apis", y1: "min_score", y2: "max_score", stroke: group, strokeOpacity: 0.35}),
    Plot.dot(rows, {x: "apis", y: "mean_score", r: "apis", fill: group, fillOpacity: 0.8, stroke: "white", strokeWidth: 0.5, tip: true,
      channels: {category: "category", "mean distinct": "mean_distinct", "range": d => `${d.min_score}–${d.max_score}`,
        "most unique": "most_unique", "least unique": "least_unique", "its nearest": "least_unique_nearest", "similarity": "least_unique_similarity",
        "place-name effect": "place_effect"}}),
    Plot.text(rows.filter(d => d.apis >= 12 || d.mean_score < 60), {x: "apis", y: "mean_score", text: "category", dy: -10, fontSize: 9, fill: "currentColor"}),
  ],
  caption: "Dashed: the most a category of n APIs allows (rarity alone, distinct = 1); lines span its APIs' lowest to highest score. "
    + "Two kinds of crowding: big science and engineering categories sit low because of rarity although their APIs' texts are distinct (≈ 0.85), "
    + "while small categories far below the dashed line (esports, EPA compliance, college sports) are near-copies of each other. "
    + "Hover a category for its most and least unique API; categories with fewer than 3 APIs are left out.",
});