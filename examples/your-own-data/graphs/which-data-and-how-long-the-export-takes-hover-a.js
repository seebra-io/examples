// The platforms by kind of data and how long the export takes. Each name
// links to where you ask for the export (↗; it assumes you're signed in
// there). Hover a name for the steps, the file that matters, what to look
// at and what to mind; the table below has the same, to copy from.
const order = ["instant", "minutes", "hours", "days", "weeks"];
const band = d => d.wait_days === 0 ? (/minute/.test(d.wait) ? "minutes" : "instant")
                : d.wait_days < 1 ? "hours" : d.wait_days <= 10 ? "days" : "weeks";
const link = d => /^https?:\/\//.test(d.where) ? d.where : null;
// one line per platform, numbered within its cell (kind × wait)
const rows = d3.flatGroup(data.map(d => ({...d, band: band(d)})), d => d.kind, d => d.band)
  .flatMap(([kind, b, v]) => v.map((d, i) => ({...d, i,
    live: d.live_api ? "live API" : "file export",
    name: d.platform + (d.live_api ? " (API)" : "") + (link(d) ? " ↗" : ""),
    url: link(d),
    detail: `${d.format} · ${d.wait}\n${d.steps}\nKey file: ${d.file || "—"}\nLook at: ${d.ideas}` +
            (d.caveat ? `\nMind: ${d.caveat}` : "") +
            (link(d) ? `\nClick to open ${new URL(d.where).hostname}` : "\nAt your own provider: no single link")})));
const cells = d3.flatRollup(rows, v => v.some(d => d.live_api) ? (v.every(d => d.live_api) ? "live API" : "both") : "file export",
                            d => d.kind, d => d.band).map(([kind, band, live]) => ({kind, band, live}));
const kinds = [...new Set(rows.map(d => d.kind))].sort();
const n = d3.max(rows, d => d.i) + 1;
return plot({
  height: kinds.length * (n * 17 + 14) + 70, marginLeft: 90, marginBottom: 40,
  x: {domain: order, label: "How long the export takes →"},
  y: {domain: [n - 0.5, -0.5], axis: null},
  fy: {domain: kinds, label: null, padding: 0.06},
  color: {legend: true, domain: ["file export", "live API", "both"], range: ["#6aa9ff", "#ffb547", "#c9a0ff"]},
  marks: [
    Plot.barY(cells, {x: "band", fy: "kind", y1: n - 0.5, y2: -0.5, fill: "live", fillOpacity: 0.12, inset: 2}),
    Plot.text(rows, {x: "band", fy: "kind", y: "i", text: "name", fill: "live", fontSize: 12,
      href: "url", target: "_blank", title: d => `${d.platform}\n${d.detail}`, tip: true})
  ]
});