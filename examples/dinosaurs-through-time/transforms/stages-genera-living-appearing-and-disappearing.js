// Per stage (PBDB diversity, genera, Foote's counts): X_bt range through the
// stage, X_Ft first appear in it and range on, X_bL last appear in it,
// X_FL appear and vanish in it. Rates are Foote's per-capita rates per Myr.
data.records.map(r => {
  const bt = r.X_bt, ft = r.X_Ft, bl = r.X_bL, fl = r.X_FL;
  const dur = r.max_ma - r.min_ma;
  const rate = (k) => (bt > 0 && dur > 0) ? Math.round(-Math.log(bt / (bt + k)) / dur * 1000) / 1000 : null;
  return {
    stage: r.interval_name,
    max_ma: r.max_ma, min_ma: r.min_ma,
    mid_ma: Math.round((r.max_ma + r.min_ma) / 2 * 100) / 100,
    duration_myr: Math.round(dur * 100) / 100,
    range_through: bt + ft + bl + fl,
    sampled: r.sampled_in_bin,
    first_appearances: ft + fl,
    last_appearances: bl + fl,
    origination_rate: rate(ft),
    extinction_rate: rate(bl),
    occurrences: r.n_occs
  };
})