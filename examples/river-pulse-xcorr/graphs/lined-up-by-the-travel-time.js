// Upstream moved forward by the best lag, on top of downstream.
const [rows, best] = data;
const b = (best || [])[0] || {};
const pts = (rows || []).filter(d => d.q_up_shifted != null).flatMap(d => [
  {t: new Date(d.time + ":00Z"), q: d.q_down, what: "near Grand Canyon (measured)", time: d.time},
  {t: new Date(d.time + ":00Z"), q: d.q_up_shifted, what: `Lees Ferry, ${b.best_lag_h} h earlier`, time: d.time}]);
return plot({
  height: fit?.height ?? 360,
  x: {type: "utc", label: "time (UTC) →"},
  y: {label: "↑ discharge (m³/s)", grid: true},
  color: {legend: true, domain: ["near Grand Canyon (measured)", `Lees Ferry, ${b.best_lag_h} h earlier`], range: ["#ea580c", "#2563eb"], label: null},
  marks: [
    Plot.lineY(pts, {x: "t", y: "q", stroke: "what", strokeWidth: 1.1}),
    Plot.tip(pts, Plot.pointer({x: "t", y: "q", stroke: "what", href: () => "https://waterdata.usgs.gov/monitoring-location/USGS-09402500/", target: "_blank", channels: {series: "what", "time (UTC)": "time", "m³/s": "q"}})),
  ],
  caption: "Moved by the lag the cross-correlation found, the upstream pulses line up with the downstream ones. What is left over is the river's own doing: "
    + "the pulse is flattened on the way (wave attenuation: the channel is a low-pass), and tributaries (the Paria, the Little Colorado) add water, most after rain (the jump on 12 October).",
});