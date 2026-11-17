// The two gauges, every 15 minutes: Lees Ferry, 25 km below Glen Canyon Dam, and the Grand Canyon gauge near Phantom Ranch, 141 km downriver.
const rows = (Array.isArray(data) ? data : []).flatMap(d => [
  {t: new Date(d.time + ":00Z"), q: d.q_up, gauge: "Lees Ferry (09380000)", href: "https://waterdata.usgs.gov/monitoring-location/USGS-09380000/", time: d.time},
  {t: new Date(d.time + ":00Z"), q: d.q_down, gauge: "near Grand Canyon (09402500)", href: "https://waterdata.usgs.gov/monitoring-location/USGS-09402500/", time: d.time}]);
return plot({
  height: fit?.height ?? 380,
  x: {type: "utc", label: "time (UTC) →"},
  y: {label: "↑ discharge (m³/s)", grid: true},
  color: {legend: true, domain: ["Lees Ferry (09380000)", "near Grand Canyon (09402500)"], range: ["#2563eb", "#ea580c"], label: "gauge"},
  marks: [
    Plot.lineY(rows, {x: "t", y: "q", stroke: "gauge", strokeWidth: 1.1}),
    Plot.tip(rows, Plot.pointer({x: "t", y: "q", stroke: "gauge", href: "href", target: "_blank", channels: {gauge: "gauge", "time (UTC)": "time", "m³/s": "q"}})),
  ],
  caption: "Glen Canyon Dam releases more water by day, when electricity is worth more, and less at night (hydropeaking): a daily swing of 70–120 m³/s travels down the Colorado. "
    + "Downstream the same pulse arrives later and flatter. Hover for values; click for the gauge's page at USGS.",
});