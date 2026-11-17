// One star, many planets: each planet's orbit weighs the same star. Systems with 5 or more planets.
// data: systems {hostname, pl_name, m_kepler, star_msun, spread_pct, offset_pct, link}
const rows = Array.isArray(data) ? data : [];
const hosts = [...new Set(rows.map(d => d.hostname))];
const stars = hosts.map(h => rows.find(d => d.hostname === h));
return plot({
  height: Math.max(420, 14 * hosts.length + 60),
  marginLeft: 120,
  x: {type: "log", label: "star mass (M☉, log scale) →", grid: true},
  y: {label: null, domain: hosts},
  marks: [
    Plot.tickX(stars, {x: "star_msun", y: "hostname", stroke: "#f97316", strokeWidth: 2, tip: true,
      channels: {"catalogue M★ (M☉)": "star_msun", "planets": "planets_here", "spread between planets (%)": "spread_pct", "mean offset from M★ (%)": "offset_pct"}}),
    Plot.dot(rows, {x: "m_kepler", y: "hostname", r: 3, fill: "#38bdf8", fillOpacity: 0.7, href: "link", target: "_blank", tip: true,
      channels: {planet: "pl_name", "a (AU)": "a_au", "P (days)": "period_days", "M from this orbit (M☉)": "m_kepler"}}),
  ],
  caption: "Blue: the mass a³/P² of each planet's orbit; orange: the catalogue's mass of the star. Within a system the planets agree (they were usually fitted with one stellar mass), "
    + "so a whole system sitting off its orange tick means its semi-major axes and the archive's adopted M★ come from different analyses. Click a planet for its system.",
});