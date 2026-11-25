// Collection gaps: the share of records that lack what a visitor needs to
// find and reuse them (coordinates for a map, a dating for a time line, a
// picture, a licence on the picture and on the record), by K-samsök record
// type (top) and by the 25 commonest object names (below). Whole set, counted
// by K-samsök. Red is mostly missing. Hover a cell for the counts. For a
// public-access report: the table on the next slide, and Download as CSV.
// "< n": a facet lists only its 100 largest terms, so a name not in a gap's
// list has fewer than n there: an upper bound.
const [types = [], names = []] = data;
const fmt = (n) => (n == null ? "?" : n.toLocaleString("sv-SE"));
const GAPS = [
  {key: "coordinates", pct: "pct_no_coordinates", n: "no_coordinates", of: "records", bound: "no_coordinates_bound"},
  {key: "dating", pct: "pct_no_dating", n: "no_dating", of: "records", bound: "no_dating_bound"},
  {key: "picture", pct: "pct_no_image", n: "no_image", of: "records", bound: "no_image_bound"},
  {key: "picture licence", pct: "pct_image_no_licence", n: "image_no_licence", of: "with_image"},
  {key: "record licence", pct: "pct_no_licence", n: "no_licence", of: "records"},
];
const long = (rows, label) => rows.flatMap((r) => GAPS.filter((g) => g.pct in r).map((g) => ({
  row: `${r[label]} (${fmt(r.records)})`, gap: g.key, pct: r[g.pct], n: r[g.n], of: r[g.of], bound: g.bound && r[g.bound],
})));
const color = {type: "linear", domain: [0, 50, 100], range: ["#166534", "#a16207", "#b91c1c"], legend: true, label: "% missing"};
const heat = (rows, label, title, h) => plot({
  height: h, width: fit?.width ?? 900, marginLeft: 200, marginTop: 34,
  x: {label: null, axis: "top", domain: GAPS.filter((g) => rows.length && g.pct in rows[0]).map((g) => g.key)},
  y: {label: null, domain: rows.map((r) => `${r[label]} (${fmt(r.records)})`)},
  color,
  marks: [
    Plot.cell(long(rows, label), {x: "gap", y: "row", fill: (d) => d.pct, inset: 1,
      channels: {missing: (d) => (d.pct == null ? "n/a (no pictures)" : `${d.bound ? "< " : ""}${fmt(d.n)} of ${fmt(d.of)}`), share: (d) => (d.pct == null ? "" : `${d.bound ? "< " : ""}${d.pct}%`)},
      tip: {format: {x: true, y: true, fill: false}}}),
    Plot.text(long(rows, label), {x: "gap", y: "row", fill: "white", fontSize: 11,
      text: (d) => (d.pct == null ? "–" : `${d.bound ? "<" : ""}${Math.round(d.pct)}%`)}),
    Plot.text([title], {frameAnchor: "top-left", dx: -196, dy: -30, fill: "currentColor", fontWeight: 600}),
  ],
});
const root = document.createElement("div");
const h = fit?.height ?? 700;
root.append(heat(types, "type", "By record type", Math.max(160, 60 + 24 * types.length)),
            heat(names, "name", "By object name (the 25 commonest)", Math.max(360, Math.min(h - 60 - 24 * types.length, 60 + 22 * names.length))));
return root;
