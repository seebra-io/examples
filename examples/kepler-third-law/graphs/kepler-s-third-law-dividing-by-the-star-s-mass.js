// Kepler's third law, before and after dividing by the star's mass. Every third planet, so the marks stay under 4,000.
// data: {panel, x, y, pl_name, hostname, discoverymethod, star_msun, a_au, period_days, m_kepler, link}
const rows = Array.isArray(data) ? data : [];
const panels = ["raw: P against a", "Kepler: P² against a³/M★"];
const line = panels.flatMap(p => {
  const xs = rows.filter(d => d.panel === p).map(d => d.x);
  const [lo, hi] = d3.extent(xs);
  // the law's prediction: slope 3/2 for P on a (for a 1 M☉ star), slope 1 through 0 for P² on a³/M★
  return p === panels[0] ? [{panel: p, x: lo, y: 1.5 * lo}, {panel: p, x: hi, y: 1.5 * hi}] : [{panel: p, x: lo, y: lo}, {panel: p, x: hi, y: hi}];
});
return plot({
  height: Math.max(420, (fit?.height ?? 480) - 40),
  marginTop: 24,
  fx: {label: null, domain: panels},
  x: {label: "log₁₀ a (AU), or log₁₀ a³/M★ (AU³/M☉) →", grid: true},
  y: {label: "↑ log₁₀ P (years), or log₁₀ P² (years²)", grid: true},
  color: {type: "log", scheme: "turbo", legend: true, label: "star mass M★ (M☉)"},
  marks: [
    Plot.line(line, {fx: "panel", x: "x", y: "y", z: "panel", stroke: "currentColor", strokeDasharray: "4,3", strokeOpacity: 0.7}),
    Plot.dot(rows, {fx: "panel", x: "x", y: "y", fill: "star_msun", r: 1.8, fillOpacity: 0.75, href: "link", target: "_blank", tip: true,
      channels: {planet: "pl_name", star: "hostname", method: "discoverymethod", "M★ (M☉)": "star_msun", "a (AU)": "a_au", "P (days)": "period_days", "M from the orbit (M☉)": "m_kepler"}}),
  ],
  caption: "Left: period against orbit size for planets around stars of every mass; the colours fan out, because a heavier star swings its planets round faster. "
    + "Right: divide a³ by the star's mass and every planet, from 0.2-day lava worlds to century-long orbits, lands on one line, P² = a³/M★ (dashed). "
    + "Hover a planet; click it for its system in the NASA Exoplanet Archive. Caveat: for most transiting planets the archive computed a from P and M★ with this law, so the right panel is partly the law checking itself (see the next chart).",
});