// The empirical cumulative distribution: for each distance, the share of
// this week's asteroids that pass at least that close. Read the median where
// the curve crosses 50%; the rings of the 3D view are the grey rules.
const rows = Array.isArray(data) ? data : [];
const s = rows[0] ?? {};
const rings = [
  {ld: 1, label: `the Moon: ${s.within_1_ld ?? 0} of ${s.n ?? 0}`},
  {ld: 10, label: `10 LD: ${s.within_10_ld ?? 0}`},
  {ld: 100, label: `100 LD: ${s.within_100_ld ?? 0}`},
];
return plot({
  marginLeft: 52,
  x: {type: "log", label: "Miss distance (lunar distances, log scale; 1 LD = 384,400 km)", grid: true},
  y: {label: "Share passing at least this close", percent: true, domain: [0, 100], grid: true},
  color: {domain: [false, true], range: ["#fbbf24", "#ef4444"], legend: true, tickFormat: d => d ? "potentially hazardous" : "not flagged"},
  marks: [
    Plot.ruleX(rings, {x: "ld", stroke: "#71717a", strokeDasharray: "4,4"}),
    Plot.text(rings, {x: "ld", text: "label", frameAnchor: "top", dy: 6, dx: 4, textAnchor: "start", fill: "#a1a1aa"}),
    Plot.ruleY([0.5], {stroke: "#71717a", strokeOpacity: 0.5}),
    Plot.text([`median ${s.median_ld ?? "?"} LD`], {x: s.median_ld, y: 0.5, dy: -8, dx: 4, textAnchor: "start", fill: "currentColor"}),
    Plot.line(rows, {x: "miss_ld", y: "share", curve: "step-after", stroke: "currentColor", strokeOpacity: 0.6}),
    Plot.dot(rows, {x: "miss_ld", y: "share", fill: "hazardous", r: 3.5,
      channels: {name: "name", date: "date", rank: "rank", "size (m)": "diameter_m"}, tip: true}),
    Plot.text([`${s.n ?? 0} asteroids; the feed lists approaches within ~195 LD only, so 100% there is its cut-off`], {
      frameAnchor: "bottom-right", dx: -8, dy: -8, fill: "#71717a"}),
  ],
});