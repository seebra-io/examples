// The table's columns, in reading order (every field is still in "missions")
data.map(d => ({name: d.name, status: d.status, kind: d.kind, agency: d.agency, arrived: d.arrived, ended: d.ended,
  years_at_mars: d.years_at_mars, now_at: d.now_at, orbit: d.orbit, instruments: d.instruments, goal: d.goal,
  highlight: d.highlight, status_note: d.status_note, status_as_of: d.status_as_of, source: d.source,
  more_sources: d.more_sources, uncertain: d.uncertain}))