// What's next: one row per mission. The pale bar is the launch range, the dot
// the current target launch, the ring the arrival at Mars, the diamond samples
// back on Earth. Shaded columns are the launch windows. Cancelled missions are
// in the table. data: [missions, windows]
const [all, wins] = data;
const ST = ["On the way", "Funded", "Partly funded", "Proposed", "Uncertain"];
const SC = ["#60a5fa", "#4ade80", "#a3e635", "#fb923c", "#facc15"];
const END = 2041;
const t = v => v == null ? null : new Date(Date.UTC(Math.floor(v), Math.floor((v % 1) * 12), 15));
const rows = all.filter(d => d.status !== "Cancelled" && d.launch_earliest != null && d.launch_earliest < END)
  .sort((a, b) => (a.launch_year != null ? a.launch_year : a.launch_earliest + 0.5) - (b.launch_year != null ? b.launch_year : b.launch_earliest + 0.5))
  .map(d => ({...d, l: t(d.launch_year), l0: t(d.launch_earliest), l1: t(Math.min(END, (d.launch_latest != null ? d.launch_latest : END) + 0.999)),
    open: d.launch_latest == null || d.launch_latest >= END, a: t(d.arrival_year), r: t(d.return_year)}));
const tips = {Agency: "agency", Launch: "launch", Arrival: "arrival", Status: "status", Why: "status_note", "As of": "status_as_of", Goal: "goal"};
return plot({
  height: 70 + 24 * rows.length, marginLeft: 220, marginRight: 20,
  caption: "Pale bar: launch range in the sources (to the edge: open-ended). Dot: target launch. Ring: arrival at Mars. Diamond: samples back on Earth. Shaded: Earth-Mars launch windows.",
  x: {type: "utc", label: null, domain: [new Date("2025-01-01"), new Date(END + "-01-01")], grid: true},
  y: {domain: rows.map(d => d.name), label: null},
  color: {legend: true, domain: ST, range: SC},
  marks: [
    Plot.rectX(wins, {x1: d => new Date(d.opens + "T00:00:00Z"), x2: d => new Date(d.closes + "T23:59:59Z"), fill: "currentColor", fillOpacity: 0.1}),
    Plot.barX(rows, {x1: "l0", x2: "l1", y: "name", fill: "status", fillOpacity: 0.3, insetTop: 5, insetBottom: 5, rx: 3, tip: true, channels: tips}),
    Plot.link(rows.filter(d => d.a && d.l), {x1: "l", x2: "a", y1: "name", y2: "name", stroke: "status", strokeOpacity: 0.7, strokeDasharray: "2,3"}),
    Plot.link(rows.filter(d => d.r && d.a), {x1: "a", x2: "r", y1: "name", y2: "name", stroke: "status", strokeOpacity: 0.4, strokeDasharray: "1,4"}),
    Plot.dot(rows.filter(d => d.a), {x: "a", y: "name", stroke: "status", strokeWidth: 2, r: 5}),
    Plot.dot(rows.filter(d => d.r), {x: "r", y: "name", fill: "status", symbol: "diamond", r: 5}),
    Plot.dot(rows.filter(d => d.l), {x: "l", y: "name", fill: "status", stroke: "currentColor", strokeWidth: 0.5, r: 6, tip: true, channels: tips}),
    Plot.text(rows.filter(d => !d.l), {x: "l0", y: "name", text: () => "no date", dx: 4, textAnchor: "start", fontSize: 10, fill: "currentColor", fillOpacity: 0.7})
  ]
});