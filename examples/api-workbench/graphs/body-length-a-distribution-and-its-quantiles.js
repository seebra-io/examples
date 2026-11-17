// The length of each post's body (characters), binned, with the 10th, 50th
// and 90th percentiles. Look at the shape before averaging it: a mean hides
// skew, a long tail and empty bodies. Caveat: JSONPlaceholder is a fixture
// (every user has exactly 10 posts, lorem ipsum bodies); a real API's counts
// per user are usually skewed, a few users with most of the records.
const q = data[0] || {};
return plot({
  height: Math.max(200, fit?.height ?? 280),
  x: {label: "Body length (characters)"},
  y: {label: "Posts", grid: true},
  marks: [
    Plot.rectY(data, Plot.binX({y: "count"}, {x: "chars", thresholds: 20, fill: "steelblue", tip: true})),
    Plot.ruleX([q.p10, q.median, q.p90], {stroke: "currentColor", strokeDasharray: "4 3"}),
    Plot.text([["p10", q.p10], ["median", q.median], ["p90", q.p90]], {x: d => d[1], text: d => `${d[0]} ${Math.round(d[1])}`, frameAnchor: "top", dy: 4, dx: 4, textAnchor: "start", fill: "currentColor"}),
    Plot.ruleY([0]),
  ],
});