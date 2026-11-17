// The share of containers that restarted at least k times, on log-log axes.
// A heavy tail falls slowly (near a straight line); the dashed line is a thin-tailed
// (geometric) count with the same mean, for comparison.
const all = Array.isArray(data) ? data : [];
const rows = all.filter(d => d.restarts >= 1);
const n = d3.sum(all, d => d.containers);
const total = d3.sum(all, d => d.restarts * d.containers);
const mean = n ? total / n : 0;
const pct = d3.format(".1%");
const maxK = d3.max(rows, d => d.restarts) ?? 1;
// geometric with mean m: P(R >= k) = (m / (1 + m))^k
const geo = d3.range(1, maxK + 1).map(k => ({restarts: k, share: Math.pow(mean / (1 + mean), k)})).filter(d => d.share >= 0.5 / Math.max(n, 1));
// how concentrated: the smallest group of top restarters that holds half of all restarts
const half = [...rows].reverse().find(d => d.restart_share >= 0.5);
return plot({
  x: {type: "log", label: "restarted at least k times →", grid: true},
  y: {type: "log", label: "↑ share of containers", grid: true, tickFormat: "~%"},
  marks: [
    Plot.line(geo, {x: "restarts", y: "share", stroke: "currentColor", strokeOpacity: 0.45, strokeDasharray: "4 3"}),
    Plot.text(geo.slice(-1), {x: "restarts", y: "share", text: () => "geometric, same mean", dy: -8, fill: "currentColor", fillOpacity: 0.6}),
    Plot.line(rows, {x: "restarts", y: "share", stroke: "#f97316"}),
    Plot.dot(rows, {x: "restarts", y: "share", fill: "#f97316", r: 4, tip: true,
      title: d => `${d.at_least} of ${n} containers (${pct(d.share)}) restarted ${d.restarts} times or more\n` +
        `together ${pct(d.restart_share)} of all ${total} restarts`}),
  ],
  caption: `${n} containers, ${total} restarts, mean ${mean.toFixed(2)} per container. ` +
    (half ? `Half of all restarts come from the ${half.at_least} containers (${pct(half.share)}) that restarted ${half.restarts}+ times: look at those, not at the average. ` : "") +
    "Where the orange line stays above the dashed one, big restart counts are far more common than a thin tail allows: crash loops, not bad luck.",
});