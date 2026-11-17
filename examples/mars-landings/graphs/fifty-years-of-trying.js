// Fifty years of trying, one row per agency: green worked, yellow landed and
// went silent, red was lost on the way down. Hover a dot for the story.
const OUT = ["Worked", "Landed, then went silent", "Lost on the way down"];
const COL = ["#4ade80", "#facc15", "#f87171"];
// a landing within five months of the agency's previous one is nudged right,
// so close pairs (Mars 2 and 3, Viking 1 and 2, Spirit and Opportunity) both show
const rows = data.map(d => ({...d, date: new Date(d.landed + "T00:00:00Z")}))
  .sort((a, b) => a.date - b.date)
  .map((d, i, all) => ({...d, near: all.slice(0, i).some(e => e.agency === d.agency && d.date - e.date < 150 * 864e5),
    // labels alternate above and below along each agency's row
    up: all.slice(0, i).filter(e => e.agency === d.agency).length % 2 === 0}));
const agencies = ["USSR", "NASA", "ESA / UK", "ESA / Roscosmos", "CNSA"];
const tally = OUT.map(o => `${rows.filter(d => d.outcome === o).length} ${o.toLowerCase()}`).join(" · ");
return plot({
  height: 300, marginLeft: 110, marginRight: 30,
  caption: `${rows.length} attempts: ${tally}`,
  x: {type: "utc", label: null, domain: [new Date("1969-01-01"), new Date("2025-01-01")]},
  y: {domain: agencies, label: null},
  color: {legend: true, domain: OUT, range: COL},
  marks: [
    Plot.ruleY(agencies, {stroke: "currentColor", strokeOpacity: 0.15}),
    Plot.dot(rows, {x: "date", y: "agency", fill: "outcome", stroke: "currentColor", r: 7, dx: 0,
      filter: d => !d.near, tip: true, channels: {Mission: "mission", Site: "site", "Landing system": "landing_system",
        "Days on the surface": "days_on_surface", "What happened": "what_happened"}}),
    Plot.dot(rows, {x: "date", y: "agency", fill: "outcome", stroke: "currentColor", r: 7, dx: 14,
      filter: d => d.near, tip: true, channels: {Mission: "mission", Site: "site", "Landing system": "landing_system",
        "Days on the surface": "days_on_surface", "What happened": "what_happened"}}),
    // names alternate above and below so neighbours don't collide
    ...[[true, false], [true, true], [false, false], [false, true]].map(([up, near]) =>
      Plot.text(rows.filter(d => d.up === up && d.near === near), {x: "date", y: "agency", text: "name",
        dy: up ? -14 : 15, dx: near ? 14 : 0, fontSize: 10, fill: "currentColor"}))
  ]
});