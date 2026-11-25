// One row per gene, with its domain: the lists joined, the nTPM per tissue left in the map
// (hover a gene on the track for them).
data.genes.map(({tissues, enriched, _lane, processes, functions, protein_class, ...g}) =>
  ({...g, processes: processes.join(", "), functions: functions.join(", "), protein_class: protein_class.join(", ")}))