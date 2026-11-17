// data[0]: rows {source, time (UTC), mw}; data[1]: sources {source, mean_mw, peak_mw, quarters, share_pct}
const W = fit?.width ?? 760, H = fit?.height ?? 420;
const rows = (data[0] || []).filter(d => d.mw != null).map(d => ({...d, t: new Date(d.time)}));
const sources = data[1] || [];
const order = sources.map(s => s.source); // generation sources, largest first (at the bottom of the stack)
const share = new Map(sources.map(s => [s.source, s.share_pct]));
const palette = {"Nuclear": "#a78bfa", "Hydro water reservoir": "#38bdf8", "Hydro Run-of-River": "#0ea5e9", "Wind onshore": "#34d399",
  "Wind offshore": "#10b981", "Solar": "#facc15", "Fossil gas": "#f97316", "Biomass": "#84cc16", "Others": "#71717a", "Waste": "#a3a3a3"};
const generation = rows.filter(d => order.includes(d.source)).map(d => ({...d, mw: Math.max(0, d.mw)}));
const load = rows.filter(d => d.source === "Load");
// one record per quarter hour, for a tip with every source at once
const byTime = d3.rollups(rows, v => Object.fromEntries(v.map(d => [d.source, d.mw])), d => +d.t)
  .map(([t, o]) => ({t: new Date(t), ...o})).sort((a, b) => a.t - b.t);
const MW = v => v == null ? "–" : d3.format(",.0f")(v) + " MW";
return plot({
  width: W, height: H,
  x: {type: "time", label: "time (local)", tickFormat: "%H:%M"},
  y: {label: "↑ generation and load (MW)", grid: true, tickFormat: "~s"},
  color: {domain: order, range: order.map(s => palette[s] || "#d4d4d8"), legend: true,
          tickFormat: s => `${s} ${share.get(s) ?? ""}%`},
  marks: [
    Plot.areaY(generation, {x: "t", y: "mw", fill: "source", order, fillOpacity: 0.85}),
    Plot.lineY(load, {x: "t", y: "mw", stroke: "currentColor", strokeWidth: 1.8, strokeDasharray: "4,3"}),
    Plot.ruleX(byTime, Plot.pointerX({x: "t", stroke: "currentColor", strokeOpacity: 0.4})),
    Plot.tip(byTime, Plot.pointerX({x: "t", y: "Load", title: d => [
      d3.timeFormat("%H:%M")(d.t),
      ...order.filter(s => d[s] != null).map(s => `${s}: ${MW(d[s])}`),
      `load: ${MW(d["Load"])}`,
      d["Cross border electricity trading"] != null ? `${d["Cross border electricity trading"] < 0 ? "net export" : "net import"}: ${MW(Math.abs(d["Cross border electricity trading"]))}` : null,
      d["Renewable share of generation"] != null ? `renewable share of generation: ${d["Renewable share of generation"]}%` : null,
    ].filter(Boolean).join("\n")})),
    Plot.ruleY([0]),
  ],
});