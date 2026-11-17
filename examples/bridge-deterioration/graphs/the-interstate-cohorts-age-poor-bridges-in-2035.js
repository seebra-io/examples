// The demographic momentum: today's cohorts, and their poor bridges if each age keeps the poor share it has today.
// data: projection {band, built, bridges, poor, share_poor, poor_2035, poor_2045, total_*, share_poor_*, extra_fixes_per_year_to_2035}
const rows = (Array.isArray(data) ? data : []).slice().sort((a, b) => b.band - a.band);
const order = rows.map(d => d.built);
const years = ["2025 (inventory)", "2035 (10 years older)", "2045 (20 years older)"];
const long = rows.flatMap(d => [
  {built: d.built, year: years[0], poor: d.poor, bridges: d.bridges},
  {built: d.built, year: years[1], poor: d.poor_2035, bridges: d.bridges},
  {built: d.built, year: years[2], poor: d.poor_2045, bridges: d.bridges}]);
const t = rows[0] || {};
const div = document.createElement("div");
div.append(
  plot({
    height: 230, marginBottom: 50,
    title: "Bridges standing in 2025, by year built (red: poor today)",
    x: {label: "built →", type: "band", domain: order, tickRotate: -45},
    y: {label: "↑ bridges", grid: true},
    marks: [
      Plot.barY(rows, {x: "built", y: "bridges", fill: "#a1a1aa", href: "link", target: "_blank", tip: true,
        channels: {"poor today": "poor", "share poor": d => (100 * d.share_poor).toFixed(1) + "%"}}),
      Plot.barY(rows, {x: "built", y: "poor", fill: "#dc2626"}),
    ],
  }),
  plot({
    height: 260, marginBottom: 50,
    title: `Poor bridges per cohort: ${t.total_poor_2025} today → ${t.total_poor_2035} in 2035 → ${t.total_poor_2045} in 2045`,
    fx: {label: "built →", domain: order, tickRotate: -45, padding: 0.1},
    x: {axis: null, domain: years},
    y: {label: "↑ poor bridges", grid: true},
    color: {legend: true, domain: years, range: ["#dc2626", "#f97316", "#facc15"]},
    marks: [Plot.barY(long, {fx: "built", x: "year", y: "poor", fill: "year", tip: true, channels: {cohort: "built", bridges: "bridges"}})],
    caption: `If each age keeps the poor share it has in the 2025 inventory (today's mix of wear, repair and replacement), ageing alone takes the poor count from ${t.total_poor_2025} `
      + `(${(100 * t.share_poor_2025).toFixed(1)}% of today's bridges) to ${t.total_poor_2035} (${(100 * t.share_poor_2035).toFixed(1)}%) in 2035 and ${t.total_poor_2045} (${(100 * t.share_poor_2045).toFixed(1)}%) in 2045: `
      + `about ${t.extra_fixes_per_year_to_2035} more bridges a year would have to leave the poor class than today just to stand still. The big 1956–1980 cohorts (a third of all bridges) are moving into the ages where about one bridge in ten is poor. `
      + `Click a grey bar for the cohort's poor bridges on the FHWA/BTS server. Caveat: a period projection (like a life table), not a forecast; new bridges and policy changes are left out.`,
  }),
);
return div;
