// L(t), runs in flight each minute, against λW, the day's arrival rate times its mean time in the system.
const [rows, law, hours] = data;
const s = (law || [])[0] || {};
const pts = (rows || []).filter(d => d.m < 1800).map(d => ({...d, h: d.t_min / 60}));
const steps = (hours || []).flatMap(d => [{h: d.hour, v: d.lambda_W, d}, {h: d.hour + 1, v: d.lambda_W, d}]);
return plot({
  height: fit?.height ?? 380,
  x: {label: "time since 00:00 UTC (hours) →", grid: true},
  y: {label: "↑ runs in the system", grid: true},
  marks: [
    Plot.areaY(pts, {x: "h", y: "in_flight", fill: "#93c5fd", fillOpacity: 0.6, curve: "step-after"}),
    Plot.line(steps, {x: "h", y: "v", stroke: "#ea580c", strokeWidth: 1.2}),
    Plot.ruleY([s.lambda_W], {stroke: "#dc2626", strokeWidth: 2}),
    Plot.ruleY([s.L_all], {stroke: "#1d4ed8", strokeDasharray: "5,3", strokeWidth: 1.5}),
    Plot.ruleX([24], {stroke: "#a1a1aa", strokeDasharray: "3,3"}),
    Plot.tip(pts, Plot.pointerX({x: "h", y: "in_flight", href: () => "https://github.com/numpy/numpy/actions", target: "_blank",
      channels: {"minute": d => `${String(Math.floor(d.m / 60) % 24).padStart(2, "0")}:${String(d.m % 60).padStart(2, "0")}${d.m >= 1440 ? " (next day)" : ""}`, "runs in flight": "in_flight"}})),
  ],
  caption: `Blue: runs in flight minute by minute. Red: λ·W = ${s.lambda_per_hour} runs/hour × ${s.W_min} min = ${s.lambda_W}. Dashed blue: the area under the blue curve over 24 h, ${s.L_all}, the same number. `
    + "That is Little's law, L = λW: the time-average number in a system equals the arrival rate times the mean time spent in it, for any arrival pattern and any service-time distribution, because both sides count the same run-minutes. "
    + "Orange: each hour's λ·W (its own arrivals and their durations), which follows the blue curve only roughly: over a window not much longer than W, runs carry load into the next hour.",
});