// If launches came at random at a steady rate (a Poisson process), the share of
// gaps lasting at least t hours would be exp(−t / mean gap): a straight line on
// a log axis. Dots are the last 100 launches; the dashed line is that model.
const rows = Array.isArray(data) ? data : [];
const s = rows[0] ?? {};
const model = d3.range(0, (d3.max(rows, d => d.gap_h) || 24) * 1.02, 1)
  .map(h => ({gap_h: h, share: Math.exp(-h / (s.mean_gap_h || 1))}));
return plot({
  marginLeft: 56,
  x: {label: "Gap between launches (hours)", grid: true},
  y: {type: "log", label: "Share of gaps at least this long (log scale)", tickFormat: "%", grid: true},
  color: false,
  marks: [
    Plot.line(model, {x: "gap_h", y: "share", stroke: "#a1a1aa", strokeDasharray: "4,3"}),
    Plot.dot(rows, {x: "gap_h", y: "share_at_least", r: 3, fill: "#38bdf8",
      channels: {launch: "name", after: "after", "UTC": "net", "model expects": "exponential"},
      tip: {format: {y: d => (100 * d).toFixed(1) + "%"}}}),
    Plot.text([[`${s.gaps ?? 0} gaps · mean ${s.mean_gap_h} h (${s.per_day} launches a day) · median ${s.median_gap_h} h`,
               `a Poisson process at that rate: ${Math.round(100 * (s.no_launch_in_a_day ?? 0))}% chance of a day with no launch`].join("\n")], {
      frameAnchor: "top-right", lineAnchor: "top", dx: -8, dy: 8, fill: "currentColor"}),
    Plot.text([`sd / mean of the gaps: ${s.cv} (1 for a Poisson process; below 1: more regular, above: more clustered)`], {
      frameAnchor: "bottom-left", dx: 8, dy: -8, fill: "#71717a"}),
  ],
});