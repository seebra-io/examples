// How long each spacecraft has been at Mars: a bar from arrival to its end (or
// to now), one row per spacecraft, grouped by where it works. Hover a bar.
const ST = ["Working", "Silent", "Ended", "On the way"];
const SC = ["#4ade80", "#facc15", "#94a3b8", "#60a5fa"];
const asOf = new Date((data[0] && data[0].as_of) + "T00:00:00Z");
const rows = data.map(d => ({...d,
  start: new Date((d.arrived || d.launched) + "T00:00:00Z"),
  stop: d.arrived ? new Date((d.ended || d.as_of) + "T00:00:00Z") : new Date((d.expected_arrival || d.as_of) + "T00:00:00Z")}))
  .sort((a, b) => a.start - b.start);
const order = rows.map(d => d.name);
return plot({
  height: 40 + 24 * rows.length, marginLeft: 210, marginRight: 120,
  caption: `Bars run from arrival to the mission's end, or to ${data[0] && data[0].as_of}. A blue bar is on its way: from launch to its expected arrival.`,
  x: {type: "utc", label: null, domain: [new Date("2000-01-01"), new Date("2028-01-01")]},
  y: {domain: order, label: null},
  color: {legend: true, domain: ST, range: SC},
  marks: [
    Plot.ruleX([asOf], {stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "3,3"}),
    Plot.barX(rows, {x1: "start", x2: "stop", y: "name", fill: "status", insetTop: 4, insetBottom: 4, rx: 3,
      tip: true, channels: {Agency: "agency", Kind: "kind", Arrived: "arrived", "Years at Mars": "years_at_mars",
        Status: "status_note", "As of": "status_as_of", Goal: "goal"}}),
    Plot.text(rows, {x: "stop", y: "name", text: d => d.years_at_mars != null ? d.years_at_mars + " yr" : "arrives " + (d.expected_arrival_text || "?").split(" (")[0],
      dx: 6, textAnchor: "start", fontSize: 10, fill: "currentColor"})
  ]
});