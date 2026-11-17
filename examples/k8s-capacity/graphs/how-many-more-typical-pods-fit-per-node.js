// How many more "typical" pods (the median request of the scheduled pods) still fit on each node,
// and the resource that stops it. A pod fits only where every resource it asks for is free at once.
const nodes = Array.isArray(data) ? [...data].sort((a, b) => b.fit - a.fit) : [];
const f = d3.format(".2~f");
const t = nodes[0] ?? {};
return plot({
  height: Math.max(160, nodes.length * 26 + 70),
  marginLeft: 150,
  x: {label: "more typical pods that fit →", grid: true, tickFormat: "d"},
  y: {label: null, domain: nodes.map(d => d.node)},
  color: {domain: ["CPU", "memory", "pod slots"], range: ["#f97316", "#38bdf8", "#a855f7"], legend: true},
  marks: [
    Plot.barX(nodes, {y: "node", x: "fit", fill: "limited_by", tip: true,
      title: d => `${d.node}: ${d.fit} more typical pods (limited by ${d.limited_by})\nby CPU ${d.fit_cpu} · by memory ${d.fit_mem} · by pod slots ${d.slots_free}\n` +
        `free ${f(d.cpu_free)} cores, ${f(d.mem_free_gib)} GiB, ${d.slots_free} pod slots`}),
    Plot.ruleX([0]),
  ],
  caption: `A typical pod here asks for ${f(t.typical_cpu)} cores and ${f(t.typical_mem_gib)} GiB (the medians over scheduled pods with both requests). ${d3.sum(nodes, d => d.fit)} more would fit in all. Your next deployment's real requests are the better yardstick: change the medians in the headroom step to them.`,
});