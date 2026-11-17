// data: anomalies {day, mean, normal, sd, p10, p90, years, anomaly, z}
// z = (day's mean - 1991–2020 normal for that calendar day) / that day's sd
const W = fit?.width ?? 720, H = fit?.height ?? 340;
const rows = (Array.isArray(data) ? data : []).filter(d => d.z != null).map(d => ({...d, t: new Date(d.day + "T12:00")}));
const lim = Math.max(2.5, d3.max(rows, d => Math.abs(d.z)) || 0);
return plot({
  width: W, height: H,
  x: {type: "band", label: null, tickFormat: d => d3.timeFormat("%a %e %b")(d)},
  y: {label: "↑ z-score (standard deviations from the normal)", domain: [-lim, lim], nice: true},
  color: {type: "diverging", scheme: "RdBu", reverse: true, domain: [-lim, lim], legend: false},
  caption: "Notice: a bar beyond ±2 would happen on about 1 day in 20 in the 1991–2020 climate. "
    + "Caveat: the climate has warmed since then, so slightly positive z is the new normal; forecasts far ahead drift toward average; "
    + "the normal is a 30-year ERA5 reanalysis grid cell, not a station.",
  marks: [
    Plot.ruleY([-2, -1, 1, 2], {stroke: "currentColor", strokeOpacity: 0.25, strokeDasharray: "3,3"}),
    Plot.barY(rows, {
      x: "t", y: "z", fill: "z", tip: true,
      channels: {"forecast mean (°C)": "mean", "normal (°C)": "normal", "sd (°C)": "sd", "anomaly (°C)": "anomaly",
                 "normal p10–p90 (°C)": d => `${d.p10} to ${d.p90}`, years: "years"},
    }),
    // the anomaly in °C at the end of each bar
    Plot.text(rows, {filter: d => d.z >= 0, x: "t", y: "z", dy: -8, text: d => `+${d.anomaly}°`}),
    Plot.text(rows, {filter: d => d.z < 0, x: "t", y: "z", dy: 8, text: d => `${d.anomaly}°`}),
    Plot.ruleY([0]),
  ],
});