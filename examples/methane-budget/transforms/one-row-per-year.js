// One row per year: concentration, growth, ENSO, the one-box budget and the three gases' forcing.
(() => { const f = new Map(data.forcing.map((r) => [r.year, r])), a = new Map(data.annual.map((r) => [r.year, r]));
  return data.budget.map((b) => ({year: b.year, ch4_ppb: +b.ppb.toFixed(1), growth_ppb: b.growth, growth_unc: a.get(b.year)?.unc ?? null, oni_lagged: a.get(b.year)?.oni == null ? null : +a.get(b.year).oni.toFixed(2),
    emitted_tg: +b.emissions.toFixed(0), destroyed_tg: +b.sink.toFixed(0), imbalance_pct: +(100 * b.imbalance).toFixed(2),
    forcing_ch4: f.get(b.year) ? +f.get(b.year).ch4.toFixed(3) : null, forcing_co2: f.get(b.year) ? +f.get(b.year).co2.toFixed(3) : null, forcing_n2o: f.get(b.year) ? +f.get(b.year).n2o.toFixed(3) : null})); })()