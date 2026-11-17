// The 20 most-read articles of the day; click a bar to open the article.
const rows = (Array.isArray(data) ? data : []).slice(0, 20);
return plot({
  marginLeft: 200,
  x: {label: "views that day →", grid: true, tickFormat: "s"},
  y: {label: null, tickFormat: t => t.length > 32 ? t.slice(0, 32) + "…" : t},
  marks: [
    Plot.barX(rows, {y: "article", x: "views", sort: {y: "-x"}, fill: "#a1a1aa", href: "link", target: "_blank",
      channels: {rank: "rank"}, tip: true}),
    Plot.ruleX([0]),
  ],
});