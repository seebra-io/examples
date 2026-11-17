// The day minute by minute: the band is each minute's lowest and highest second, the line its mean.
const rows = Array.isArray(data) ? data.map(d => ({...d, time: new Date(d.time)})) : [];
const link = "https://www.energy-charts.info/charts/frequency/chart.htm?l=en&c=DE";
const lim = [
  {y: 200, label: "+200 mHz: primary control (FCR) fully used"}, {y: -200, label: "−200 mHz"},
  {y: 50, label: "±50 mHz: standard frequency range"}, {y: -50, label: ""},
  {y: 10, label: "±10 mHz: FCR insensitivity"}, {y: -10, label: ""},
];
const lo = Math.min(-60, d3.min(rows, d => d.min_df_mhz) - 5), hi = Math.max(60, d3.max(rows, d => d.max_df_mhz) + 5);
return plot({
  height: fit?.height ?? 380,
  x: {type: "utc", label: "time (UTC) →"},
  y: {label: "↑ frequency − 50 Hz (mHz)", domain: [lo, hi], grid: true},
  marks: [
    Plot.ruleY(lim.filter(l => l.y > lo && l.y < hi), {y: "y", stroke: "#f97316", strokeOpacity: 0.5, strokeDasharray: "4,3"}),
    Plot.text(lim.filter(l => l.label && l.y > lo && l.y < hi), {y: "y", frameAnchor: "left", dx: 4, text: "label", dy: -6, textAnchor: "start", fill: "#f97316", fontSize: 10}),
    Plot.areaY(rows, {x: "time", y1: "min_df_mhz", y2: "max_df_mhz", fill: "#60a5fa", fillOpacity: 0.3}),
    Plot.lineY(rows, {x: "time", y: "mean_df_mhz", stroke: "#2563eb", strokeWidth: 1}),
    Plot.ruleY([0]),
    Plot.tip(rows, Plot.pointerX({x: "time", y: "mean_df_mhz", href: () => link, target: "_blank",
      channels: {"minute (UTC)": "clock", "mean Δf (mHz)": "mean_df_mhz", "lowest (mHz)": "min_df_mhz", "highest (mHz)": "max_df_mhz",
                 "largest |df/dt| (mHz/s)": "max_abs_rocof_mhz_s", "primary control power, mean (MW)": "mean_fcr_mw", "seconds measured": "seconds"}})),
    Plot.dot(rows, Plot.pointerX({x: "time", y: "mean_df_mhz", r: 3, fill: "#2563eb", tip: true, href: () => link, target: "_blank"})),
  ],
  caption: "The grid's frequency is its balance meter: above 50 Hz more power is fed in than used (the spinning generators speed up), below it less. "
    + "Primary control answers in seconds in proportion to the deviation, like a P controller: 3000 MW across Continental Europe at ±200 mHz (hover: the implied power). "
    + "Notice the regular spikes: they come at the quarter-hours (next chart). Measured at one point (Freiburg), but the synchronous grid shares one frequency.",
});