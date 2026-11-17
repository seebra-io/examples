// Components per status, GitHub and Cloudflare side by side (small multiples).
const rows = Array.isArray(data) ? data : [];
const order = ["operational", "degraded_performance", "partial_outage", "major_outage", "under_maintenance"];
return plot({
  marginLeft: 150,
  x: {label: "components →", grid: true},
  y: {label: null, domain: order.filter(s => rows.some(d => d.status === s))},
  fy: {label: null},
  color: {domain: order, range: ["#22c55e", "#eab308", "#f97316", "#ef4444", "#60a5fa"]},
  marks: [
    Plot.barX(rows, {fy: "service", y: "status", x: "components", fill: "status", tip: true}),
    Plot.text(rows, {fy: "service", y: "status", x: "components", text: d => d.components, dx: 4, textAnchor: "start", fill: "currentColor"}),
    Plot.ruleX([0]),
  ],
});