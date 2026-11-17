// When each painting was made, as the museum dates it: a bar from the earliest to the
// latest year ("c. 1650" is 1645-1655, "1200s" a whole century), a dot at the midpoint.
// The shaded band is the middle half of the midpoints (25th to 75th percentile), the line
// the median. Hover for the record; click to open it at clevelandart.org.
const [paintings, q] = [data[0], data[1]?.[0] ?? {}];
return plot({
  marginLeft: 8,
  x: {label: "year made (earliest to latest)", tickFormat: "d", grid: true},
  y: {axis: null, domain: paintings.slice().sort((a, b) => a.midpoint - b.midpoint).map((d) => d.title + d.url)},
  color: false,
  marks: [
    Plot.rectX([q], {x1: "q25", x2: "q75", fill: "#f59e0b", fillOpacity: 0.12}),
    Plot.ruleX([q], {x: "median", stroke: "#f59e0b", strokeDasharray: "4,3"}),
    Plot.text([q], {x: "median", frameAnchor: "top", dy: -2, dx: 4, textAnchor: "start", fill: "currentColor",
      text: (d) => `median ${Math.round(d.median)} · middle half ${Math.round(d.q25)}-${Math.round(d.q75)} · n = ${d.paintings}`}),
    Plot.ruleY(paintings, {y: (d) => d.title + d.url, x1: "earliest", x2: (d) => Math.max(d.latest, d.earliest + 3), stroke: "#a1a1aa", strokeWidth: 4, strokeOpacity: 0.6}),
    Plot.dot(paintings, {y: (d) => d.title + d.url, x: "midpoint", r: 3.5, fill: "#f59e0b", href: "url", target: "_blank",
      channels: {title: "title", artist: "artist", dated: "date", culture: "culture", technique: "technique"}, tip: true}),
  ],
});