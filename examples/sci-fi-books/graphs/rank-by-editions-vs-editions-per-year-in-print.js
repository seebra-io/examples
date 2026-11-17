// A rate needs an exposure: editions divided by the years since first publication.
// Raw counts favour old works (Frankenstein has had 200 years); per year in print, newer
// works climb. Dots move from grey (rank by raw editions) to blue (rank by editions per year).
const rows = data.slice(0, 25);
return plot({
  marginLeft: 190,
  x: {label: "rank among the dated works (1 = top)", grid: true},
  y: {domain: rows.map((d) => d.title), label: null, tickFormat: (t) => t.length > 30 ? t.slice(0, 30) + "…" : t},
  color: false,
  marks: [
    Plot.link(rows, {x1: "rank_by_editions", x2: "rank_by_rate", y1: "title", y2: "title", stroke: "currentColor", strokeOpacity: 0.3, markerEnd: "arrow"}),
    Plot.dot(rows, {x: "rank_by_editions", y: "title", fill: "#a1a1aa", r: 3}),
    Plot.dot(rows, {x: "rank_by_rate", y: "title", fill: "#60a5fa", r: 5, href: "url", target: "_blank",
      channels: {author: "author", "first published": "first_published", editions: "editions",
                 "years in print": "years_in_print", "editions per year": "editions_per_year"}, tip: true}),
  ],
});