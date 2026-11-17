// One row per genus, labelled with the group whose query found it.
// first_ma / last_ma: the oldest and youngest age PBDB gives its finds (Ma).
// Trace fossils (footprints, eggs: PBDB flag I) are kept but marked.
(() => {
  const groups = ["Theropods (with early birds)", "Sauropodomorphs", "Ornithischians"];
  return data.flatMap((answer, i) => ((answer && answer.records) || [])
    .filter(r => r.firstapp_max_ma != null && r.lastapp_min_ma != null)
    .map(r => ({
      genus: r.taxon_name,
      clade: groups[i],
      family: r.family && r.family !== "NO_FAMILY_SPECIFIED" ? r.family : "",
      trace_fossil: /I/.test(r.flags || ""),
      first_ma: r.firstapp_max_ma,
      last_ma: r.lastapp_min_ma,
      span_myr: Math.round((r.firstapp_max_ma - r.lastapp_min_ma) * 10) / 10,
      first_interval: r.early_interval || "",
      last_interval: r.late_interval || r.early_interval || "",
      finds: r.n_occs,
      pbdb: "https://paleobiodb.org/classic/basicTaxonInfo?taxon_no=" + r.orig_no
    })));
})()