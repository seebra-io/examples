// The network by origin: how much time each origin's resources took and how long their first byte was.
// data: network {origin, type, n, total_ms, mean_ms, slowest_ms, mean_wait_ms, kib, during_moves}
const rows = (Array.isArray(data) ? data : []).map(d => ({...d, total_ms: Math.max(0, d.total_ms)}));
const origins = d3.rollups(rows, v => d3.sum(v, d => d.total_ms), d => d.origin).sort((a, b) => b[1] - a[1]).slice(0, 15).map(d => d[0]);
const shown = rows.filter(d => origins.includes(d.origin));
return plot({
  height: Math.max(340, 28 * origins.length + 90),
  marginLeft: 230,
  x: {label: "summed load time of the origin's resources (ms) →", grid: true},
  y: {label: null, domain: origins},
  color: {legend: true, label: "type (initiator)", scheme: "tableau10"},
  marks: [
    Plot.barX(shown, Plot.stackX({x: "total_ms", y: "origin", fill: "type", tip: true,
      href: d => d.origin ? `https://${d.origin}` : null, target: "_blank",
      channels: {resources: "n", "mean (ms)": "mean_ms", "slowest (ms)": "slowest_ms", "mean time to first byte (ms)": "mean_wait_ms", "KiB transferred": "kib", "loaded while the canvas moved": "during_moves"}})),
  ],
  caption: "Every resource the browser loaded in this session (Resource Timing), summed per origin and coloured by what asked for it (script, link, css, fetch, img...). "
    + "Parallel loads overlap, so a sum is work, not waiting. Cross-origin resources without a Timing-Allow-Origin header report 0 bytes and no first-byte time. The table 'slowest resources' links to each one."
});
