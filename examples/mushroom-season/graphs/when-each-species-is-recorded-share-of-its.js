// Each species' records per month as a share of its own total, against all fungi (grey, dashed):
// the grey curve is mostly effort, people searching in autumn. Hover a point for records and enrichment.
// data: phenology {species, latin, month, records, share, fungi_share, enrichment}
const rows = Array.isArray(data) ? data : [];
const colors = {"All fungi": "#a1a1aa", "Chanterelle": "#f59e0b", "Funnel chanterelle": "#a16207", "Porcini": "#b45309", "Fly agaric": "#ef4444", "False morel": "#8b5cf6"};
const names = Object.keys(colors);
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
return plot({
  height: Math.max(340, (fit?.height ?? 420) - 40),
  color: {domain: names, range: names.map(n => colors[n]), legend: true},
  x: {label: "month →", domain: d3.range(1, 13), tickFormat: m => months[m - 1]},
  y: {label: "↑ share of the species' records", grid: true, tickFormat: "%"},
  marks: [
    Plot.line(rows, {x: "month", y: "share", stroke: "species", strokeWidth: d => d.species === "All fungi" ? 1.5 : 2,
      strokeDasharray: d => d.species === "All fungi" ? "4,3" : null, curve: "monotone-x"}),
    Plot.dot(rows, {x: "month", y: "share", fill: "species", r: 3, tip: true,
      title: d => `${d.species} (${d.latin}), ${months[d.month - 1]}\n${d3.format(",")(d.records)} records: ${d3.format(".1%")(d.share)} of its year\n` +
        (d.species === "All fungi" ? "the baseline (effort and fruiting of all fungi together)" : `${d3.format(".2f")(d.enrichment)}× all fungi's share that month`)}),
  ],
  caption: "GBIF occurrences in Sweden 2000–2025 (records, not abundance: they follow where and when people look). The false morel fruits in spring, the rest in late summer and autumn; the funnel chanterelle comes latest.",
});