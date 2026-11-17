// Distance against time around each approach, from the estimate (lines), with
// JPL's nominal closest distance as a tick at hour 0. A narrow V is a fast
// flyby, a wide U a slow one. Grey: an estimate the check step distrusts.
const [paths = [], checks = []] = Array.isArray(data) ? data : [];
const bad = new Set(checks.filter(c => c.trust !== "yes").map(c => c.name));
return plot({
  marginLeft: 52,
  x: {label: "Hours from JPL's closest-approach time", grid: true},
  y: {type: "log", label: "Distance from Earth (lunar distances, log)", grid: true},
  color: {legend: false},
  marks: [
    Plot.ruleY([1], {stroke: "#a1a1aa", strokeDasharray: "4,4"}),
    Plot.text(["the Moon's distance"], {x: -96, y: 1, dy: -6, textAnchor: "start", fill: "#a1a1aa"}),
    Plot.line(paths, {x: "hours", y: "r_ld", z: "name", stroke: d => bad.has(d.name) ? "#71717a" : (d.jpl_ld < 5 ? "#ef4444" : "#fbbf24"), strokeOpacity: 0.8}),
    Plot.dot(checks, {x: 0, y: "jpl_ld", symbol: "times", r: 4, stroke: "currentColor",
      channels: {name: "name", date: "date", "JPL (LD)": "jpl_ld", "estimate (LD)": "estimate_ld", "off %": "off_pct", trust: "trust"}, tip: true}),
    Plot.tip(paths, Plot.pointer({x: "hours", y: "r_ld", channels: {name: "name", "km/s": "v_rel_kms", "size m": "size_m"}})),
  ],
});
