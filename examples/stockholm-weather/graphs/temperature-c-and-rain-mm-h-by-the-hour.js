// data[0]: hours {time (local), day, temp °C, rain mm}; data[1]: days {day, low, high, mean, rain_mm}
const W = fit?.width ?? 720, H = fit?.height ?? 420;
const hours = (data[0] || []).map(d => ({...d, t: new Date(d.time)}));
const days = (data[1] || []).map(d => ({...d, t0: new Date(d.day + "T00:00"), t1: new Date(d.day + "T23:59")}));
const x = {type: "time", domain: d3.extent(hours, d => d.t)};
const wrap = document.createElement("div");
// temperature, with each day's low-high band and a label on top
wrap.append(plot({
  width: W, height: Math.round(H * 0.66), marginBottom: 20,
  x: {...x, label: null},
  y: {label: "↑ temperature (°C)", grid: true, nice: true},
  marks: [
    Plot.rect(days, {x1: "t0", x2: "t1", y1: "low", y2: "high", fill: "#38bdf8", fillOpacity: 0.1, insetLeft: 2, insetRight: 2}),
    Plot.text(days, {x: d => new Date((+d.t0 + +d.t1) / 2), frameAnchor: "top", fillOpacity: 0.7,
                     text: d => `${d3.timeFormat("%a")(d.t0)} ${Math.round(d.low)}–${Math.round(d.high)}°`}),
    Plot.lineY(hours, {x: "t", y: "temp", stroke: "#f97316", strokeWidth: 2, tip: true,
                       channels: {"rain (mm)": "rain"}}),
  ],
}));
// hourly rain under it, on its own axis
wrap.append(plot({
  width: W, height: Math.round(H * 0.34),
  x: {...x, label: null},
  y: {label: "↑ rain (mm/h)", grid: true, nice: true, domain: [0, Math.max(1, d3.max(hours, d => d.rain) || 0)]},
  marks: [
    Plot.rectY(hours, {x1: "t", x2: d => new Date(+d.t + 3600e3), y: "rain", fill: "#60a5fa", tip: true,
                       channels: {"temperature (°C)": "temp"}}),
    Plot.ruleY([0]),
  ],
}));
return wrap;