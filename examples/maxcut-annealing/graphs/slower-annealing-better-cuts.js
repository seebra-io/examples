// How often annealing finds the best cut, by schedule length (sweeps, log
// scale). Hover for the mean cut as a share of the best. A random split
// almost never does; a slow enough schedule nearly always does.
const sa = data.filter(d => d.method === "Simulated annealing");
const rnd = data.find(d => d.method === "Random split");
return plot({
  marginLeft: 50, height: 320,
  caption: rnd ? `Random split: best cut in ${rnd.found_best} of ${rnd.runs} tries, mean ${(rnd.mean_ratio * 100).toFixed(1)}% of the best` : null,
  x: {type: "log", label: "Annealing schedule (sweeps, each n moves) →"},
  y: {label: "↑ Runs that found the best cut (%)", domain: [0, 100], grid: true},
  marks: [
    Plot.line(sa, {x: "sweeps", y: "found_best_pct", stroke: "#f59e0b", strokeWidth: 2}),
    Plot.dot(sa, {x: "sweeps", y: "found_best_pct", r: 5, fill: "#f59e0b", tip: true,
      channels: {Sweeps: "sweeps", "Found the best": "found_best", Runs: "runs", "Mean cut / best": "mean_ratio", "Worst cut": "worst_cut"}})
  ]
});