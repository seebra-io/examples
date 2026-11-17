// The coming launches per provider over time, coloured by status; faint when
// the date is known only to the day or month. Hover for the record, click for
// its Launch Library page.
const [launches = [], providers = []] = data;
const precise = d => ["Second", "Minute", "Hour"].includes(d.precision);
const rows = launches.map(d => ({...d, t: new Date(d.net), dated: precise(d) ? "to the hour or better" : "day, month or later"}));
const chart = plot({
  marginLeft: 210,
  x: {type: "utc", label: "Net launch time (UTC; NET = no earlier than)", grid: true},
  y: {domain: providers.map(p => p.provider), label: null, tickFormat: p => p.length > 32 ? p.slice(0, 32) + "…" : p},
  color: {domain: ["Go", "TBC", "TBD", "Hold", "Success"], range: ["#22c55e", "#facc15", "#71717a", "#ef4444", "#38bdf8"], legend: true},
  marks: [
    Plot.ruleX([new Date()], {stroke: "#f97316"}),
    Plot.dot(rows, {x: "t", y: "provider", fill: "status", stroke: "status", r: 5,
      fillOpacity: d => precise(d) ? 0.9 : 0.3,
      channels: {launch: "name", rocket: "rocket", "date known": "precision", "window (h)": "window_h",
                 mission: "mission_type", orbit: "orbit", pad: "pad", place: "location"},
      tip: true}),
    Plot.text(["faint: date known only to the day or month · orange: now"], {frameAnchor: "top-left", dy: -2, fill: "#71717a"}),
  ],
});
// click the hovered launch: its Launch Library record
chart.addEventListener("click", () => chart.value?.url && window.open(chart.value.url, "_blank", "noopener"));
return chart;