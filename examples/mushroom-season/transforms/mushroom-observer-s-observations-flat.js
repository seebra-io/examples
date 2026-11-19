// One flat row per observation: the fields used next, with its namings and
// votes counted here. Read as one table, the nested namings (each with its
// own reasons) stopped the data runtime ("should be a list at this point")
({ results: (data.results || []).map((o) => ({
  id: o.id, date: o.date, confidence: o.confidence,
  consensus: o.consensus ? o.consensus.name : null,
  location: o.location ? o.location.name : null,
  namings: (o.namings || []).length, votes: (o.votes || []).length,
  primary_image: o.primary_image ? o.primary_image.id : null,
})) })
