// The distribution of first-publication years, per decade. Not a history of the genre:
// these are the 48 works with the MOST editions, and old works have had longer to collect them.
return plot({
  x: {label: "first published (decade; empty decades are gaps)", tickFormat: "d"},
  y: {label: "works (of the 48 most-edited)", grid: true},
  color: false,
  marks: [
    Plot.rectY(data, {x1: "decade", x2: (d) => d.decade + 10, y: "books", fill: "#60a5fa", inset: 0.5,
      channels: {"editions in all": "editions", "most editions": "most_editions"}, tip: true}),
    Plot.ruleY([0]),
  ],
});