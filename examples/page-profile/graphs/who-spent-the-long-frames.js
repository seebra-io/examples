// Where the main thread's time went: total script time in long frames, by script, coloured by who wrote it.
// data: scripts {origin, file, name, invoker_type, party, runs, total_ms, longest_ms, forced_layout_ms, runs_while_moving}
const rows = (Array.isArray(data) ? data : []).slice(0, 18).map(d => ({...d, label: `${d.file || d.origin || "?"} · ${String(d.name).replace(/^https?:\/\//, "").slice(0, 48)}`}));
const total = d3.sum(Array.isArray(data) ? data : [], d => d.total_ms);
const byParty = d3.rollups(Array.isArray(data) ? data : [], v => d3.sum(v, d => d.total_ms), d => d.party);
return plot({
  height: Math.max(360, 26 * rows.length + 80),
  marginLeft: 300,
  x: {label: "time in long frames (ms) →", grid: true},
  y: {label: null, domain: rows.map(d => d.label)},
  color: {domain: ["this page (Seebra)", "third party", "no source URL"], range: ["#2563eb", "#f97316", "#94a3b8"], legend: true},
  marks: [
    Plot.barX(rows, {x: "total_ms", y: "label", fill: "party", tip: true,
      href: d => d.origin && /^https?:/.test(d.name) ? d.name : null, target: "_blank",
      channels: {script: "name", from: "origin", invoker: "invoker_type", runs: "runs", "longest run (ms)": "longest_ms",
                 "forced style & layout (ms)": "forced_layout_ms", "runs while the canvas moved": "runs_while_moving"}}),
    Plot.text(rows, {x: "total_ms", y: "label", text: d => `${Math.round(d.total_ms)} ms`, dx: 4, textAnchor: "start", fontSize: 10}),
  ],
  caption: `Scripts that ran in long frames, ${Math.round(total)} ms in all: `
    + byParty.map(([p, ms]) => `${p} ${Math.round(100 * ms / (total || 1))}%`).join(", ") + ". "
    + "LoAF names each script by its source URL and function (or how it was invoked: an event listener, a promise, a timer). Seebra's own bundle is minified, so its names are short; "
    + "the Seebra spans in the timeline say which graph or step ran. Forced style & layout is time a script made the browser lay out the page synchronously: a common cause of jank."
});
