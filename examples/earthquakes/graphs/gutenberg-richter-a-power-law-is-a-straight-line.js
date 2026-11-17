// Gutenberg–Richter: N(at least M) = N(4.5) · 10^(−b·(M − 4.5)). On a log
// y-axis that is a straight line; its slope is the b-value (about 1 worldwide).
const rows = Array.isArray(data) ? data : [];
const b = rows[0]?.b, se = rows[0]?.b_se, total = rows[0]?.total;
return plot({
  marginLeft: 56,
  x: {label: "Magnitude M (0.1 bins)", grid: true},
  y: {type: "log", label: "Quakes of at least M this week (count, log scale)", grid: true},
  color: false,
  marks: [
    // the fitted power law (Aki's maximum-likelihood b)
    Plot.line(rows, {x: "m", y: "expected", stroke: "#a1a1aa", strokeDasharray: "4,3"}),
    // what the week measured: quakes at least this strong
    Plot.dot(rows, {x: "m", y: "n_at_least", r: 4, fill: "#f97316",
      channels: {"quakes at this M": "n", "power law expects": "expected"},
      tip: {format: {x: true, y: true}}}),
    Plot.text([`b = ${b} ± ${se} (from ${total} quakes) · dashed: the fitted power law`], {
      frameAnchor: "top-right", dx: -8, dy: 8, fill: "currentColor", fontSize: 12}),
    Plot.text(["A small week: the top end is a few quakes, so its steps are noise; b ≈ 1 is the usual value"], {
      frameAnchor: "bottom-left", dx: 8, dy: -8, fill: "#71717a"}),
  ],
});