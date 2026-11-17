// The average day in May–June 2026 (local time): load, residual load and the price.
const rows = Array.isArray(data) ? data : [];
const series = [["load_gw", "load"], ["residual_gw", "residual load"], ["solar_gw", "solar"], ["wind_gw", "wind"]];
const long = rows.flatMap(r => series.map(([k, label]) => ({local_hour: r.local_hour, series: label, gw: r[k], price: r.price, negative_pct: r.negative_pct})));
const w = fit?.width ?? 640, h = fit?.height ?? 460;
const root = d3.create("div");
root.append(() => plot({
  width: w, height: Math.round(h * 0.58),
  x: {label: null, domain: [0, 23], ticks: d3.range(0, 24, 3)},
  y: {label: "↑ GW (hourly mean over the days)", grid: true},
  color: {legend: true, domain: series.map(s => s[1]), range: ["#111827", "#2563eb", "#f59e0b", "#10b981"]},
  marks: [
    Plot.lineY(long, {x: "local_hour", y: "gw", stroke: "series", strokeWidth: d => d.series === "residual load" ? 3 : 1.6, tip: true,
      channels: {"hour (CEST)": "local_hour", series: "series", GW: "gw", "mean price (EUR/MWh)": "price"}}),
    Plot.ruleY([0]),
  ],
}));
root.append(() => plot({
  width: w, height: Math.round(h * 0.42),
  x: {label: "hour of day (CEST) →", domain: [0, 23], ticks: d3.range(0, 24, 3)},
  y: {label: "↑ EUR/MWh", grid: true},
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(rows, {x: "local_hour", y: "price", stroke: "#dc2626", strokeWidth: 2.5}),
    Plot.lineY(rows, {x: "local_hour", y: "median_price", stroke: "#dc2626", strokeDasharray: "4,3"}),
    Plot.dot(rows, {x: "local_hour", y: "price", fill: "#dc2626", r: 2.5, tip: true,
      channels: {"hour (CEST)": "local_hour", "mean price": "price", "median price": "median_price", "hours below 0 EUR (%)": "negative_pct",
        "residual load (GW)": "residual_gw", "solar (GW)": "solar_gw", "gas (GW)": "gas_gw"}}),
  ],
  caption: "The duck: solar digs a trough into the residual load at midday, and the price (solid mean, dashed median) falls into the same trough, often below zero, then climbs to its peak in the evening ramp when the sun sets and demand is still high. Load alone has no such dip.",
}));
return root.node();