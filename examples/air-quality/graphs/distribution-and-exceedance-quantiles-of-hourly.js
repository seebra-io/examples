// data: exceedance, one row per city: hourly PM2.5 quantiles (µg/m³) and
// how many daily means were above the WHO 24-hour guideline (15 µg/m³)
const W = fit?.width ?? 720, H = fit?.height ?? 360;
const rows = Array.isArray(data) ? data : [];
const cities = rows.map(d => d.city); // sorted by median, highest first
return plot({
  width: W, height: H, marginLeft: 92, marginRight: 110,
  x: {label: "PM2.5 by the hour (µg/m³): line p10–p90, box p25–p75, tick median, × the highest hour", grid: true, nice: true},
  y: {label: null, domain: cities},
  caption: "Notice: the WHO 24-hour guideline is a 99th percentile, meant to be exceeded on at most 3–4 days a year, so even one day over in five is a lot. "
    + "Caveat: these are five modelled days, two of them forecast; a year of station data is what the guideline is judged on.",
  marks: [
    Plot.ruleX([15], {stroke: "#ef4444", strokeDasharray: "5,4"}),
    Plot.ruleY(rows, {y: "city", x1: "p10", x2: "p90", stroke: "currentColor", strokeOpacity: 0.5}),
    Plot.barX(rows, {
      y: "city", x1: "p25", x2: "p75", fill: "steelblue", fillOpacity: 0.7, insetTop: 6, insetBottom: 6, tip: true,
      channels: {median: "median", p10: "p10", p90: "p90", "highest hour": "max", "hours over 15": "hours_over",
                 "share of hours over 15 (%)": "share_hours_over_pct", "days with mean over 15": d => `${d.days_over} of ${d.days}`},
    }),
    Plot.tickX(rows, {y: "city", x: "median", strokeWidth: 2.5, insetTop: 4, insetBottom: 4}),
    Plot.dot(rows, {y: "city", x: "max", symbol: "times", r: 3}),
    Plot.text(rows, {y: "city", frameAnchor: "right", textAnchor: "start", dx: 8,
                     fill: d => d.days_over > 0 ? "#ef4444" : "currentColor",
                     text: d => `${d.days_over}/${d.days} days over`}),
  ],
});