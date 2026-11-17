// Recalls per firm (the top firms among the latest reports), stacked by class
const [firms, recalls] = data;
const top = new Set((firms || []).map(f => f.firm));
const order = (firms || []).map(f => f.firm);
const classes = ["Class I", "Class II", "Class III"];
const meaning = {"Class I": "may cause serious harm or death", "Class II": "temporary or reversible harm", "Class III": "unlikely to cause harm"};
const rows = (recalls || []).filter(r => top.has(r.firm));
return plot({
  height: (fit?.height ?? 400) - 40,
  marginLeft: 220,
  x: {label: "recalls (count, of the latest reports)", grid: true, tickFormat: "d"},
  y: {label: null, domain: order, tickFormat: f => f.length > 34 ? f.slice(0, 34) + "…" : f},
  color: {domain: classes, range: ["#ef4444", "#f97316", "#facc15"]},
  marks: [
    Plot.barX(rows, Plot.groupY({x: "count", title: g => {
        const r = g[0];
        const reasons = d3.rollups(g, a => a.length, d => d.reason).sort((a, b) => b[1] - a[1]).slice(0, 3);
        return `${r.firm} (${r.state ?? "?"})\n${g.length} × ${r.class}: ${meaning[r.class] ?? ""}\n` +
          reasons.map(([s, n]) => `${n}× ${s.length > 70 ? s.slice(0, 70) + "…" : s}`).join("\n");
      }}, {y: "firm", fill: "class", title: d => d, tip: true})),
    Plot.ruleX([0]),
  ],
  caption: "Counts, not rates: a firm with more products on the market has more to recall, and openFDA has no product count per recalling firm to divide by (NDC labeler names don't match firm names). See the rate per route for a fair comparison.",
});