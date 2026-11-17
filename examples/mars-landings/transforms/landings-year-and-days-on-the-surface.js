// One row per landing attempt, with the year and how long it lasted on the
// surface (days from landing to last contact; empty while still working).
data.landings.map(d => ({
  ...d,
  year: +d.landed.slice(0, 4),
  days_on_surface: d.outcome !== "Worked" ? 0
    : d.last_contact ? Math.round((new Date(d.last_contact) - new Date(d.landed)) / 864e5) : null
}))