// Views against age on log scales: answered (green) or not yet (orange), size by |score|.
// Click a dot to open the question.
const qs = Array.isArray(data) ? data : [];
return plot({
  x: {type: "log", label: "hours before the newest activity in the list (≈ age) →", grid: true},
  y: {type: "log", label: "↑ views (log scale)", grid: true, tickFormat: "s"},
  r: {range: [3, 14]},
  color: {legend: true, domain: ["answered", "not yet"], range: ["#22c55e", "#f97316"]},
  marks: [
    Plot.dot(qs, {x: d => Math.max(0.1, d.age_h), y: d => Math.max(1, d.views), r: d => Math.abs(d.score),
      fill: d => d.answered ? "answered" : "not yet", fillOpacity: 0.65, stroke: "currentColor", strokeOpacity: 0.3,
      href: "link", target: "_blank",
      channels: {title: "title", score: "score", answers: "answers", tags: d => d.tags.join(", ")}, tip: true}),
  ],
});