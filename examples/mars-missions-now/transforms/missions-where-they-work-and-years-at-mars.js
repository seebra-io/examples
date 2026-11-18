// One row per spacecraft, with the years it has spent at Mars (to its end, or
// to the date the data was checked) and where it works: the ground or orbit.
// (One expression: a JavaScript step returns its value.)
data.missions.map(d => ({
  ...d,
  where: /Orbiter/.test(d.kind) ? "In orbit" : "On the ground",
  arrival_year: d.arrived ? +d.arrived.slice(0, 4) : null,
  years_at_mars: d.arrived ? +((new Date(d.ended || data.checked) - new Date(d.arrived)) / (365.25 * 864e5)).toFixed(1) : null,
  as_of: data.checked
}))