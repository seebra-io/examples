// Zipf's law: rank against views on log–log axes. A power law views ≈ C · rank^(−s)
// is a straight line here; the orange line is the least-squares fit of log views on log rank.
const rows = Array.isArray(data) ? data : [];
const s = rows[0]?.zipf_s;
return plot({
  x: {type: "log", label: "rank (log scale) →", grid: true},
  y: {type: "log", label: "↑ views that day (log scale)", grid: true, tickFormat: "s"},
  marks: [
    Plot.dot(rows, {x: "rank", y: "views", r: 2, fill: "#a1a1aa", fillOpacity: 0.7, href: "link", target: "_blank",
      channels: {article: "article", "fitted views": "fitted", "views / fitted": "ratio"}, tip: true}),
    Plot.line(rows, {x: "rank", y: "fitted", stroke: "#f97316", strokeWidth: 2}),
    Plot.text([`fitted exponent s = ${s} (Zipf: s ≈ 1) · ${rows.length} articles`], {frameAnchor: "top-right", dy: 4, fill: "currentColor"}),
    Plot.text(["the list stops at the API's top 1000: the tail beyond it is cut off"], {frameAnchor: "bottom-left", dx: 4, dy: -4, fill: "currentColor", fillOpacity: 0.6}),
  ],
});