// Points against comments, both on log scales (points and comments are heavy-tailed).
// The six most frequent sites get a colour; click a dot to open the HN thread.
const rows = Array.isArray(data) ? data : [];
const top = d3.rollups(rows, v => v.length, d => d.site).sort((a, b) => b[1] - a[1]).slice(0, 6).map(d => d[0]);
const site = d => top.includes(d.site) ? d.site : "other";
const max = d3.max(rows, d => Math.max(d.points, d.comments)) || 10;
return plot({
  x: {type: "log", label: "points (log scale) →", grid: true},
  y: {type: "symlog", label: "↑ comments (symlog scale)", grid: true},
  color: {legend: true, domain: [...top, "other"]},
  marks: [
    // dashed: as many comments as points; above it a story is discussed more than voted on
    Plot.line([[1, 1], [max, max]], {stroke: "currentColor", strokeOpacity: 0.3, strokeDasharray: "4,4"}),
    Plot.dot(rows, {x: d => Math.max(1, d.points), y: "comments", fill: site, r: 5, fillOpacity: 0.75,
      href: "link", target: "_blank",
      channels: {title: "title", site: "site", "hours before newest": "hours_before_newest"},
      tip: {format: {x: true, y: true, fill: false}}}),
    Plot.text(rows.slice(0, 3), {x: "points", y: "comments", text: d => d.title.length > 40 ? d.title.slice(0, 40) + "…" : d.title,
      dx: -8, textAnchor: "end", fill: "currentColor"}),
  ],
});