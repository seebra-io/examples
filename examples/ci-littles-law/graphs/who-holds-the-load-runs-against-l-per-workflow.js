// Which workflows hold the runners: share of the runs (grey) against share of L (blue).
const rows = (Array.isArray(data) ? data : []).slice(0, 15);
const ch = {workflow: "name", runs: "runs", "mean time in system (min)": "W_min", "λ (runs/hour)": "lambda_per_hour", "L of this workflow": "L_part", "share of runs": d => (100 * d.share_of_runs).toFixed(1) + "%", "share of L": d => (100 * d.share_of_L).toFixed(1) + "%"};
return plot({
  height: Math.max(360, rows.length * 28 + 70),
  marginLeft: 220,
  x: {label: "share →", tickFormat: "%", grid: true},
  y: {label: null, domain: rows.map(d => d.name)},
  marks: [
    Plot.barX(rows, {x: "share_of_runs", y: "name", fill: "#d4d4d8", insetTop: 2, insetBottom: 2}),
    Plot.barX(rows, {x: "share_of_L", y: "name", fill: "#2563eb", insetTop: 8, insetBottom: 8, tip: true, href: "example_run", target: "_blank", channels: ch}),
    Plot.ruleX([0]),
  ],
  caption: "Grey: share of the day's runs (λ). Blue: share of the load L = λW. L adds up over parts, L = Σ λᵢWᵢ: the workflow that arrives most often (the CircleCI artifact redirector) holds almost none of the load because it leaves within seconds, "
    + "while the long test and wheel matrices hold most of it. To cut the load on runners, shorten the long ones; making the frequent short ones rarer changes little. Click a bar for a run of that workflow.",
});