// How the target launch dates moved: each mission's earlier targets (grey)
// and today's (coloured: the target, or the earliest it could be when there is none).
const ST = ["On the way", "Funded", "Partly funded", "Proposed", "Uncertain"];
const SC = ["#60a5fa", "#4ade80", "#a3e635", "#fb923c", "#facc15"];
const rows = data.filter(d => d.slipped_years.length && (d.launch_year != null || d.launch_earliest != null))
  .map(d => ({...d, now: d.launch_year != null ? d.launch_year : d.launch_earliest, net: d.launch_year == null}))
  .sort((a, b) => b.years_slipped - a.years_slipped);
const pts = rows.flatMap(d => d.slipped_years.map(y => ({name: d.name, year: y + 0.5, all: d.earlier_targets})));
return plot({
  height: 70 + 32 * rows.length, marginLeft: 220, marginRight: 80,
  caption: "Grey: launch years announced earlier. Coloured: the target now (\"NET\": no target, the earliest it could be). Hover a dot for what was said.",
  x: {label: "Launch year", tickFormat: d => String(d), grid: true, domain: [2016, 2035]},
  y: {domain: rows.map(d => d.name), label: null},
  color: {legend: true, domain: ST, range: SC},
  marks: [
    Plot.link(rows, {x1: d => d.first_target_year + 0.5, x2: "now", y1: "name", y2: "name", stroke: "status", strokeOpacity: 0.5, strokeWidth: 2}),
    Plot.dot(pts, {x: "year", y: "name", fill: "#9ca3af", r: 4, tip: true, channels: {"Earlier targets": "all"}}),
    Plot.dot(rows, {x: "now", y: "name", fill: "status", r: 6, symbol: d => d.net ? "triangle" : "circle", tip: true,
      channels: {"Target now": "launch", "Earlier targets": "earlier_targets", Status: "status", Why: "status_note"}}),
    Plot.text(rows, {x: "now", y: "name", text: d => (d.net ? "NET, " : "") + "+" + d.years_slipped + " yr", dx: 10, textAnchor: "start", fontSize: 10, fill: "currentColor"})
  ]
});