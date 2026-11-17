// How many pods each PodDisruptionBudget lets go right now. At 0, an eviction answers 429.
const rows = (Array.isArray(data) ? data : []).map(d => ({...d, label: `${d.namespace}/${d.budget}`}));
return plot({
  height: Math.max(140, rows.length * 24 + 70),
  marginLeft: 220,
  x: {label: "disruptions allowed now →", grid: true, tickFormat: "d"},
  y: {label: null, domain: rows.map(d => d.label)},
  color: {domain: ["allows evictions", "blocks evictions"], range: ["#22c55e", "#ef4444"], legend: true},
  marks: [
    Plot.barX(rows, {y: "label", x: d => Math.max(d.allowed, 0.08), fill: d => d.allowed === 0 ? "blocks evictions" : "allows evictions", tip: true,
      title: d => `${d.label}: ${d.allowed} disruption${d.allowed === 1 ? "" : "s"} allowed\nhealthy ${d.healthy} of ${d.expected} pods; needs ${d.desired_healthy} healthy\n` +
        (d.allowed === 0 ? "an eviction of its pods answers 429 until more are healthy" : "an eviction of one of its pods is allowed"),
      href: () => "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets", target: "_blank"}),
    Plot.ruleX([0]),
  ],
  caption: "A budget at 0 is usually a workload that is already short of healthy pods: evicting would make it worse, which is why the API refuses. Click a bar for how budgets work.",
});