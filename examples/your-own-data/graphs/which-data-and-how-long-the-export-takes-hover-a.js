// The platforms by kind of data and how long the export takes. Hover a cell
// for the steps, the file that matters and what to look at.
// The table below has the links.
const order = ["instant", "minutes", "hours", "days", "weeks"];
const band = d => d.wait_days === 0 ? (/minute/.test(d.wait) ? "minutes" : "instant")
                : d.wait_days < 1 ? "hours" : d.wait_days <= 10 ? "days" : "weeks";
// one cell per kind and wait; the platforms in it are listed one per line
const cells = d3.flatRollup(data.map(d => ({...d, band: band(d)})), v => v, d => d.kind, d => d.band)
  .map(([kind, band, v]) => ({kind, band, n: v.length,
    names: v.map(d => d.platform + (d.live_api ? " (API)" : "")).join("\n"),
    live: v.some(d => d.live_api) ? (v.every(d => d.live_api) ? "live API" : "both") : "file export",
    detail: v.map(d => `${d.platform} · ${d.format} · ${d.wait}\n${d.steps}\nKey file: ${d.file || "—"}\nLook at: ${d.ideas}` +
                       (d.caveat ? `\nMind: ${d.caveat}` : "")).join("\n\n")}));
const kinds = [...new Set(cells.map(d => d.kind))].sort();
const rowH = Math.max(34, ...cells.map(d => d.n * 16 + 10));
return plot({
  height: kinds.length * rowH + 70, marginLeft: 90, marginBottom: 40,
  x: {domain: order, label: "How long the export takes →"},
  y: {label: null, domain: kinds},
  color: {legend: true, domain: ["file export", "live API", "both"], range: ["#6aa9ff", "#ffb547", "#c9a0ff"]},
  marks: [
    Plot.cell(cells, {x: "band", y: "kind", fill: "live", fillOpacity: 0.12, inset: 2}),
    Plot.text(cells, {x: "band", y: "kind", text: "names", fill: "live", fontSize: 12, lineHeight: 1.3}),
    Plot.tip(cells, Plot.pointer({x: "band", y: "kind", title: "detail", maxRadius: 60}))
  ]
});