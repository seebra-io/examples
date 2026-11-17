// The market's probability of each outcome by deadline: one line per "by
// ...?" or "continues through ...?" event, its deadlines along x. Read a
// line as a cumulative probability: "a ceasefire by 31 March" at 20% means
// 80% that there is none by then. Hollow dots break the ordering (a later
// deadline priced lower for "by", higher for "through"): a thin or stale
// market, so read it with its spread. Lines with under US$ 25,000 traded in
// all are left out (the table has them). Hover a dot for the market.
const rows = Array.isArray(data) ? data : [];
const MIN_VOLUME = 25000;
const volume = d3.rollup(rows, v => d3.sum(v, d => d.volume_usd), d => d.event);
const shown = rows.filter(d => volume.get(d.event) >= MIN_VOLUME).map(d => ({...d, date: new Date(d.deadline), event: d.event.trim()}));
const short = s => s.replace(/\s*(by|through)\s*(\.\.\.|…)\??\s*$/i, "").replace(/\?$/, "");
// one label per line at its last deadline, skipped when it would overlap a
// higher one there (hover still names every line)
const H = fit?.height ?? 400, MIN_GAP = 13 / Math.max(120, H - 60);
const last = [...d3.group(shown, d => d.event).values()].map(v => v.reduce((a, b) => b.date > a.date ? b : a))
  .sort((a, b) => b.date - a.date || b.yes - a.yes);
const labels = [];
for (const d of last) if (!labels.some(l => +l.date === +d.date && Math.abs(l.yes - d.yes) < MIN_GAP)) labels.push(d);
return plot({
  marginRight: 230, marginLeft: 48,
  x: {type: "time", label: "Deadline", grid: true},
  y: {label: "Market probability of Yes", percent: true, domain: [0, 100], grid: true},
  color: {legend: false},
  marks: [
    Plot.ruleY([0]),
    Plot.line(shown, {x: "date", y: "yes", z: "event", stroke: "event", strokeOpacity: 0.85, curve: "step-after"}),
    Plot.dot(shown, {x: "date", y: "yes", stroke: "event", fill: d => d.consistent ? d.event : "none", r: 3.5,
      channels: {event: "event", question: "question", spread: "spread", "volume US$": "volume_usd"}, tip: true}),
    Plot.text(labels, {x: "date", y: "yes", text: d => short(d.event), fill: "event", dx: 6, textAnchor: "start", lineWidth: 28}),
  ],
});
