// The table's columns, in reading order (every field is still in "missions")
data.map(d => ({name: d.name, status: d.status, launch: d.launch, arrival: d.arrival, kind: d.kind, agency: d.agency,
  goal: d.goal, status_note: d.status_note, status_as_of: d.status_as_of, earlier_targets: d.earlier_targets,
  cost: d.cost, source: d.source, more_sources: d.more_sources, uncertain: d.uncertain}))