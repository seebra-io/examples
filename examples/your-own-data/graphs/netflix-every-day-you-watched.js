// Every day you watched something, as a calendar: one square per day, darker
// is more titles. Hover for what it was. Three or more episodes of one series
// in a day is listed under Binges.
const rows = data.filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d.date));
const byDay = d3.rollups(rows, v => v, d => d.date).map(([date, v]) => ({
  date: new Date(date + "T00:00:00Z"), n: v.length,
  what: [...new Set(v.map(d => d.series))].join(", ")}));
const first = d3.min(byDay, d => d.date), last = d3.max(byDay, d => d.date);
const week = d => d3.utcMonday.count(d3.utcMonday.floor(first), d);
const weeks = week(last) + 1;
const cell = Math.max(6, Math.min(16, Math.floor((fit.width - 60) / weeks)));
return plot({
  width: Math.min(fit.width, weeks * cell + 60), height: 7 * cell + 60, marginLeft: 40, padding: 0.1,
  x: {axis: null, domain: d3.range(weeks)},
  y: {domain: [0, 1, 2, 3, 4, 5, 6], tickFormat: i => "MTWTFSS"[i], label: null},
  color: {scheme: "reds", legend: true, label: "Titles that day"},
  marks: [
    Plot.cell(byDay, {x: d => week(d.date), y: d => (d.date.getUTCDay() + 6) % 7, fill: "n", inset: 0.5,
                      title: d => `${d.date.toISOString().slice(0, 10)} · ${d.n} title${d.n > 1 ? "s" : ""}\n${d.what}`}),
    Plot.text(d3.utcMonths(first, last), {x: d => week(d3.utcMonday.ceil(d)), y: -0.9, text: d3.utcFormat("%b"), frameAnchor: "left"})
  ]
});