// A July week: the daily swing of the air, and what is left of it at each depth.
const rows = (Array.isArray(data) ? data : []).map(d => ({...d, t: new Date(d.time + ":00Z")}));
const layers = ["air (2 m)", "soil 0–7 cm", "soil 7–28 cm", "soil 28–100 cm", "soil 100–255 cm"];
return plot({
  height: fit?.height ?? 380,
  x: {type: "utc", label: "July 2024 (UTC) →"},
  y: {label: "↑ temperature (°C)", grid: true},
  color: {legend: true, domain: layers, range: ["#a1a1aa", "#f97316", "#dc2626", "#7c3aed", "#1e3a8a"], label: "layer"},
  marks: [
    Plot.lineY(rows, {x: "t", y: "temp_c", stroke: "layer", strokeWidth: 1.4}),
    Plot.tip(rows, Plot.pointer({x: "t", y: "temp_c", stroke: "layer", href: () => "https://open-meteo.com/en/docs/historical-weather-api", target: "_blank",
      channels: {layer: "layer", "layer middle (m)": "depth_m", "hour (UTC)": "time", "°C": "temp_c"}})),
  ],
  caption: "Berlin, one summer week. The air swings 10–15 °C between day and night; the top 7 cm of soil follows with less swing and an hour late, at 7–28 cm the swing is a few tenths and peaks in the evening, "
    + "and below 28 cm the daily cycle is gone: only the slow seasonal level is left. The ground is a low-pass filter: fast changes are damped first.",
});