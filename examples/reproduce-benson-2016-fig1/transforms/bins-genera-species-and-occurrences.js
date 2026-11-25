// One row per PBDB ten-million-year bin (time_reso=bin): genera and species
// found in it (face value) and ranging through it, and the fossil
// occurrences behind them. Bins are labelled as the paper labels its own
// (Tr1 = the first Triassic bin): PBDB's bins are close to Benson et al.'s
// but not the same (their S1 Table), so expect small shifts.
(() => {
  const code = { Triassic: "Tr", Jurassic: "J", Cretaceous: "K", Cenozoic: "Pg" };
  const label = (name) => {
    const m = /^(\w+)\s+(\d+)$/.exec(name || "");
    return m && code[m[1]] ? code[m[1]] + m[2] : name;
  };
  const species = new Map(((data[1] && data[1].records) || []).map((r) => [r.interval_name, r]));
  return ((data[0] && data[0].records) || []).map((g) => {
    const s = species.get(g.interval_name) || {};
    const rt = (r) => (r.X_bt || 0) + (r.X_Ft || 0) + (r.X_bL || 0) + (r.X_FL || 0);
    return {
      bin: label(g.interval_name),
      interval: g.interval_name,
      max_ma: g.max_ma,
      min_ma: g.min_ma,
      mid_ma: Math.round((g.max_ma + g.min_ma) / 2 * 100) / 100,
      mesozoic: g.min_ma >= 65.99,
      genera: g.sampled_in_bin,
      genera_range_through: rt(g),
      species: s.sampled_in_bin != null ? s.sampled_in_bin : null,
      species_range_through: s.X_bt != null ? rt(s) : null,
      occurrences: g.n_occs,
      // the records behind this bin, from PBDB (open in a browser or a new query)
      records_url: "https://paleobiodb.org/data1.2/occs/list.csv?base_name=Tetrapoda&envtype=terrestrial&pres=regular&idreso=genus" +
        `&max_ma=${g.max_ma}&min_ma=${g.min_ma}&timerule=contain&show=genus,coords,ref&limit=all`
    };
  }).sort((a, b) => b.mid_ma - a.mid_ma);
})()