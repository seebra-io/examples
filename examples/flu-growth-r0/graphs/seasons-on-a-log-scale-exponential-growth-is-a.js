// Influenza seasons, US, week by week (ILI+: % of outpatient visits with
// influenza-like illness that are influenza, on a log scale). On a log
// axis exponential growth is a straight line: the dashed segments are the
// fitted e^(r t) of each season's growth window, and their slope is r.
// Notice how similar the slopes are, and how gentle: ILI+ doubles in one
// to three weeks. Hover a week for its numbers; click for CDC FluView.
const [weeks, fits] = [data[0] || [], data[1] || []];
const seasons = [...new Set(weeks.map(d => d.season))];
const lines = fits.flatMap(f => d3.range(f.t0, f.t1 + 0.01, 0.5).map(t => ({season: f.season, t, y: Math.exp(f.intercept + f.r_week * t), R: f.R})));
return plot({
  height: Math.max(400, (fit?.height ?? 480) - 20),
  x: {label: "weeks since epiweek 40 (early October) →", domain: [0, 40], grid: true},
  y: {type: "log", label: "↑ ILI+ (% of visits: ILI × % positive for influenza)", domain: [0.005, 10], grid: true, tickFormat: "~g"},
  color: {domain: seasons, scheme: "turbo", legend: true},
  marks: [
    Plot.line(weeks.filter(d => d.ili_plus > 0.004), {x: "t", y: "ili_plus", stroke: "season", strokeWidth: 1.5, strokeOpacity: 0.85}),
    Plot.line(lines, {x: "t", y: "y", z: "season", stroke: "currentColor", strokeDasharray: "3 3", strokeWidth: 1.5}),
    Plot.dot(weeks.filter(d => d.ili_plus > 0.004), {x: "t", y: "ili_plus", fill: "season", r: 2, href: () => "https://www.cdc.gov/fluview/", target: "_blank", tip: true,
      channels: {season: "season", epiweek: "epiweek", "wILI %": "wili", "% positive": "percent_positive", "specimens": "total_specimens", "share B": "share_b"}}),
  ],
  caption: "Dashed: the exponential fitted on each season's growth window (5–60% of its peak). 2020–21 and 2021–22 (peaks under 0.3%) are not fitted.",
});