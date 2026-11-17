// Each day's swing at both gauges.
const rows = (Array.isArray(data) ? data : []);
const long = rows.flatMap(d => [{day: d.day, v: d.up_swing, gauge: "Lees Ferry", d}, {day: d.day, v: d.down_swing, gauge: "near Grand Canyon", d}]);
const wd = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
return plot({
  height: fit?.height ?? 320,
  x: {label: null, tickFormat: d => String(d).slice(5), tickRotate: -45},
  fx: {label: null, axis: null},
  y: {label: "↑ daily swing, highest − lowest flow (m³/s)", grid: true},
  color: {legend: true, domain: ["Lees Ferry", "near Grand Canyon"], range: ["#2563eb", "#ea580c"], label: "gauge"},
  marks: [
    Plot.barY(long, {x: "day", y: "v", fill: "gauge", fillOpacity: 0.85, mixBlendMode: "multiply", tip: true, href: () => "https://waterdata.usgs.gov/monitoring-location/USGS-09380000/", target: "_blank",
      channels: {day: d => `${d.day} (${wd[d.d.weekday] || ""})`, gauge: "gauge", "swing (m³/s)": "v", "downstream / upstream": d => d.d.swing_ratio, "water gained on the way (m³/s)": d => d.d.gained}}),
    Plot.ruleY([0]),
  ],
  caption: "Downstream the daily swing is smaller: the pulse spreads out as it travels (a kinematic wave with diffusion), so the canyon sees a gentler version of the dam's schedule. "
    + "Days differ (the schedule follows power demand and weekends); that day-to-day variation is what lets the cross-correlation tell one day's pulse from the next.",
});