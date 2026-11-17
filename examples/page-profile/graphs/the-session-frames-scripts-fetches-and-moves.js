// The session on one time axis: what the main thread and the network did while you loaded the page, panned and clicked.
// data: timeline {kind, lane, name, origin, file, detail, start_s, end_s, duration_ms, blocking_ms, status, moving}
const rows = Array.isArray(data) ? data : [];
const spans = rows.filter(d => d.kind !== "paint" && d.kind !== "lcp");
const instants = rows.filter(d => d.kind === "paint" || d.kind === "lcp");
const color = d => d.kind === "move" ? "#a855f7" : d.kind === "frame" || d.kind === "task" ? (d.duration_ms >= 200 ? "#dc2626" : "#f59e0b")
  : d.kind === "script" ? "#fb923c" : d.kind === "request" ? "#0ea5e9" : d.kind === "interaction" ? "#22c55e" : d.kind === "span" ? "#e11d48" : "#94a3b8";
const link = d => d.kind === "resource" && /^https?:/.test(d.name) ? d.name : null;
return plot({
  height: Math.max(380, (fit?.height ?? 420) - 40),
  marginLeft: 120,
  x: {label: "seconds since the page loaded →", grid: true},
  y: {label: null, domain: [...new Set(spans.map(d => d.lane))].sort()},
  marks: [
    Plot.barX(spans, {x1: "start_s", x2: d => Math.max(d.end_s, d.start_s + 0.004), y: "lane", fill: color, fillOpacity: 0.75, inset: 1,
      href: link, target: "_blank", tip: true,
      channels: {what: "name", from: "origin", file: "file", type: "detail", "duration (ms)": "duration_ms", "blocking (ms)": "blocking_ms", status: "status", "canvas moving": "moving"}}),
    Plot.ruleX(instants, {x: "start_s", stroke: d => d.kind === "lcp" ? "#16a34a" : "#64748b", strokeDasharray: "4,3", tip: true,
      channels: {what: d => d.kind === "lcp" ? `largest contentful paint (${d.name})` : d.name, "at (ms)": "duration_ms"}}),
  ],
  caption: "Purple: canvas moves (pan, zoom, drag). Amber and red: long animation frames (≥ 50 ms; red ≥ 200 ms), with the scripts that ran in them below. Blue: fetches from the page; grey: every resource the browser loaded (click one to open it). "
    + "Green: interactions; dashed lines: first paint, first contentful paint and LCP. Look for long frames and fetches that sit under a purple bar: those are what made a pan stutter. "
    + "The table refreshes with the timer; numbers depend on this machine, its other tabs and extensions."
});
