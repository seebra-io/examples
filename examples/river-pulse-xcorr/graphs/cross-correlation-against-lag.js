// Cross-correlation against lag: how well the upstream record, moved forward by the lag, matches the downstream one.
const [rows, best] = data;
const b = (best || [])[0] || {};
const long = (rows || []).flatMap(d => [{lag_h: d.lag_h, r: d.r_ramp, what: "changes (dQ per 15 min)", n: d.n}, {lag_h: d.lag_h, r: d.r_flow, what: "flows", n: d.n}]);
return plot({
  height: fit?.height ?? 380,
  x: {label: "lag: downstream compared with upstream that many hours earlier →", domain: [0, 48], ticks: d3.range(0, 49, 6)},
  y: {label: "↑ correlation r", domain: [-1, 1], grid: true},
  color: {legend: true, domain: ["changes (dQ per 15 min)", "flows"], range: ["#2563eb", "#a1a1aa"], label: "correlated"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([b.best_lag_h], {stroke: "#dc2626", strokeWidth: 1.5}),
    Plot.ruleX([b.runner_up_lag_h], {stroke: "#dc2626", strokeDasharray: "4,3"}),
    Plot.lineY(long, {x: "lag_h", y: "r", stroke: "what", strokeWidth: 1.5}),
    Plot.tip(long, Plot.pointer({x: "lag_h", y: "r", stroke: "what", channels: {"lag (h)": "lag_h", r: "r", "pairs compared": "n"}})),
  ],
  caption: `The correlation peaks at ${b.best_lag_h} h (red, r = ${b.best_r}): the travel time, found without knowing anything about rivers, the way GPS, radar and sonar find delays. `
    + `141 km in ${b.best_lag_h} h is ${b.celerity_km_h} km/h (${b.celerity_m_s} m/s), the speed of the pulse, not of the water. `
    + `But a periodic signal correlates with itself every period: the next peak, at ${b.runner_up_lag_h} h (dashed, r = ${b.runner_up_r}), is almost as good, and a negative lag 24 h earlier would be too. `
    + "What decides is causality (the lag can't be negative) and what isn't periodic: the day-to-day changes in the dam's schedule. Correlating the changes (blue) sharpens the peaks, a whitening step.",
});