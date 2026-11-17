// Events that repeat: occurrences per hour between an event's first and its latest report.
// A count needs its time span: 200 repeats in two weeks is calmer than 20 in an hour.
const rows = (Array.isArray(data) ? data : []).slice(0, 20).map(d => ({...d, label: `${d.namespace ? d.namespace + "/" : ""}${d.object} · ${d.reason}`}));
const short = s => s.length > 50 ? s.slice(0, 49) + "…" : s;
return plot({
  height: Math.max(180, rows.length * 22 + 70),
  marginLeft: 320,
  x: {type: "log", label: "occurrences per hour (log) →", grid: true},
  y: {label: null, domain: rows.map(d => d.label), tickFormat: short},
  r: {range: [3, 12]},
  marks: [
    Plot.dot(rows, {y: "label", x: "per_hour", r: "occurrences", fill: "#f97316", tip: true,
      title: d => `${d.kind} ${d.object}: ${d.reason}, ${d.occurrences} times\nfirst ${d.first}, latest ${d.last} (${d.hours.toFixed(1)} h): ${d.per_hour.toFixed(2)} an hour\n${d.message}`}),
  ],
  caption: "Dot size: the total count. The rate assumes the repeats were spread over the whole span; the API only keeps the first and latest time.",
});