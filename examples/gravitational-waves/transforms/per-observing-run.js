// Mergers per observing run and per week; O4c's are not yet in a catalogue.
data.runs.map((r) => ({...r, per_week: +r.per_week.toFixed(2)}))