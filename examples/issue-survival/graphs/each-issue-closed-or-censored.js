// Each issue as a bar from when it was opened (0) to its close, or to the last look if it's still open (censored).
// Click a bar to open the issue on GitHub.
const rows = (Array.isArray(data) ? data : []).map((d, i) => ({...d, row: i}));
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 40),
  marginLeft: 50,
  x: {type: "symlog", constant: 7, label: "days open (symlog scale) →", grid: true, ticks: [0, 1, 7, 30, 90, 180, 365, 600]},
  y: {label: "issues, by time open", axis: null},
  color: {domain: ["closed", "still open (censored)"], range: ["#a1a1aa", "#f97316"], legend: true},
  marks: [
    Plot.ruleY(rows, {y: "row", x1: 0, x2: d => Math.max(d.days, 0.01), stroke: d => d.closed ? "closed" : "still open (censored)", strokeWidth: 3,
      href: "url", target: "_blank", tip: true,
      title: d => `#${d.number} ${d.title}\n${d.kind}${d.labels ? " · " + d.labels : ""}\nopened ${d.created_at.slice(0, 10)}, ` +
        (d.closed ? `closed ${d.closed_at.slice(0, 10)} (${d.state_reason ?? "closed"}) after ${d.days} days` : `still open after ${d.days} days`)}),
    Plot.dot(rows.filter(d => !d.closed), {y: "row", x: "days", fill: "#f97316", symbol: "triangle", r: 3}),
  ],
  caption: "Orange bars end at the last look, not at a close: their true length is unknown, only longer. That is right-censoring.",
});