// Each work: when it first appeared against how many editions it has (log scale:
// a step up is ten times more). Colour: the authors with more than one work here.
// Hover for the work; click a dot to open it on Open Library.
const books = data.filter((b) => b.first_published);
const byAuthor = d3.rollups(books, (v) => v.length, (b) => b.author).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
const top = byAuthor.slice(0, 8).map(([a]) => a);
return plot({
  x: {label: "first published (year)", tickFormat: "d"},
  y: {type: "log", label: "editions (log scale)", grid: true},
  color: {domain: [...top, "other"], label: "author"},
  marks: [
    Plot.dot(books, {x: "first_published", y: "editions", r: 5, fillOpacity: 0.8,
      fill: (b) => top.includes(b.author) ? b.author : "other",
      stroke: (b) => b.readable ? "white" : "none", href: "url", target: "_blank",
      channels: {title: "title", author: "author", "free to read": (b) => b.readable ? "yes" : "no"}, tip: true}),
    Plot.text(books.slice().sort((a, b) => b.editions - a.editions).slice(0, 4),
      {x: "first_published", y: "editions", text: (b) => b.title.length > 28 ? b.title.slice(0, 28) + "…" : b.title,
       dx: 8, textAnchor: "start", fill: "currentColor"}),
  ],
});