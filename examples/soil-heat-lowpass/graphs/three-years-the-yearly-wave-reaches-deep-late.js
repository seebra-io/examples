// Three years in weekly means: the annual wave goes deep, but arrives late.
const rows = (Array.isArray(data) ? data : []).map(d => ({...d, t: new Date(d.time + ":00Z")}));
const layers = ["air (2 m)", "soil 0–7 cm", "soil 7–28 cm", "soil 28–100 cm", "soil 100–255 cm"];
return plot({
  height: fit?.height ?? 380,
  x: {type: "utc", label: "week (UTC) →"},
  y: {label: "↑ weekly mean temperature (°C)", grid: true},
  color: {legend: true, domain: layers, range: ["#a1a1aa", "#f97316", "#dc2626", "#7c3aed", "#1e3a8a"], label: "layer"},
  marks: [
    Plot.lineY(rows, {x: "t", y: "temp_c", stroke: "layer", strokeWidth: 1.3}),
    Plot.tip(rows, Plot.pointer({x: "t", y: "temp_c", stroke: "layer", href: () => "https://open-meteo.com/en/docs/historical-weather-api", target: "_blank",
      channels: {layer: "layer", "week starting (UTC)": "time", "°C": "temp_c"}})),
  ],
  caption: "The yearly cycle passes the daily filter: at 1–2.5 m it still swings about ±6 °C, but its summer peak comes about two months after the air's, and in late winter the deep soil is the warmest place. "
    + "Hover a week; the lags and damping per layer are in the response table.",
});