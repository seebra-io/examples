// Heavy tail: stories sorted by points, with the mean and the median as lines.
// A few big stories pull the mean up; the median is the typical front-page story.
const [rows = [], summary = []] = Array.isArray(data) ? data : [];
const s = summary[0] ?? {};
const ranked = rows.map((d, i) => ({...d, rank: i + 1}));
return plot({
  x: {label: "story, by points (rank) →", tickFormat: d => (d % 5 === 0 || d === 1) ? d : ""},
  y: {label: "↑ points", grid: true},
  marks: [
    Plot.barY(ranked, {x: "rank", y: "points", fill: d => d.points > s.mean_points ? "#f97316" : "#a1a1aa",
      channels: {title: "title", site: "site", comments: "comments"}, tip: true}),
    Plot.ruleY([s.mean_points], {stroke: "#f97316", strokeDasharray: "5,4"}),
    Plot.ruleY([s.median_points], {stroke: "#60a5fa"}),
    Plot.text([`mean ${s.mean_points}`], {frameAnchor: "right", y: s.mean_points, dy: -7, fill: "#f97316"}),
    Plot.text([`median ${s.median_points}`], {frameAnchor: "right", y: s.median_points, dy: -7, fill: "#60a5fa"}),
    Plot.text([`${s.above_mean} of ${s.stories} stories are above the mean; the top one has ${s.top_share}% of all points`],
      {frameAnchor: "top-right", dy: 4, fill: "currentColor", fillOpacity: 0.7}),
    Plot.ruleY([0]),
  ],
});