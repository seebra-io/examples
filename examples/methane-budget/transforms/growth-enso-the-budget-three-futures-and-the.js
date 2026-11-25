// Methane in the global atmosphere, its growth and what moves it.
// data[0]: NOAA's monthly global CH4 (ppb, marine surface sites, with a
// de-seasonalised trend); data[1]: NOAA's annual growth (ppb/yr);
// data[2], data[3]: NOAA's monthly global CO2 (ppm) and N2O (ppb);
// data[4]: NOAA CPC's Oceanic Niño Index (ONI: three-month sea-surface
// temperature anomaly in the Niño 3.4 box; ≥ 0.5 El Niño, ≤ −0.5 La Niña).
// Steps: the monthly growth rate as the 12-month change of the trend; ENSO
// per month; their correlation at lags of −6 to +24 months (ENSO first);
// each gas's radiative forcing since pre-industrial times with the
// simplified formulas of Myhre et al. (1998), used by IPCC since; and the
// budget in one box, emissions = growth + what the sink removes (M/τ),
// with three futures from today's emissions.
(() => {
  const [chText, grText, co2Text, n2oText, oniText] = data;
  const rows = (t) => String(t || "").split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#")).map((l) => l.trim().split(/\s+/));
  const num = (v) => { const x = +v; return Number.isFinite(x) && x > -9 ? x : null; };
  const month = (y, m) => y * 12 + (m - 1);
  const label = (k) => `${Math.floor(k / 12)}-${String(k % 12 + 1).padStart(2, "0")}`;

  const ch4 = rows(chText).map((r) => ({k: month(+r[0], +r[1]), t: +r[2], ppb: num(r[3]), trend: num(r[5])})).filter((r) => r.ppb != null);
  const byK = new Map(ch4.map((r) => [r.k, r]));
  for (const r of ch4) { const p = byK.get(r.k - 12); r.growth = p && r.trend != null && p.trend != null ? r.trend - p.trend : null; }
  const annual = rows(grText).map((r) => ({year: +r[0], growth: num(r[1]), unc: num(r[2])})).filter((r) => r.growth != null);

  // ONI: the season DJF centres on January, JFM on February, …
  const SEAS = ["DJF", "JFM", "FMA", "MAM", "AMJ", "MJJ", "JJA", "JAS", "ASO", "SON", "OND", "NDJ"];
  const oni = new Map();
  for (const r of rows(oniText)) { const i = SEAS.indexOf(r[0]); if (i >= 0 && num(r[3]) != null) oni.set(month(+r[1], i + 1), +r[3]); }
  const phase = (v) => v >= 0.5 ? "El Niño" : v <= -0.5 ? "La Niña" : "neutral";

  // correlation of growth with ENSO lag months earlier
  const corr = (xs, ys) => { const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; } return sxy / Math.sqrt(sxx * syy); };
  // growth detrended by its 7-year running mean: the decade-scale rise is not ENSO's
  const g = ch4.filter((r) => r.growth != null);
  for (const r of g) { const w = g.filter((q) => Math.abs(q.k - r.k) <= 42); r.slow = w.reduce((s, q) => s + q.growth, 0) / w.length; r.fast = r.growth - r.slow; }
  const lags = [];
  for (let lag = -6; lag <= 24; lag++) {
    const pairs = g.filter((r) => oni.has(r.k - lag)).map((r) => [oni.get(r.k - lag), r.fast]);
    lags.push({lag, r: corr(pairs.map((p) => p[0]), pairs.map((p) => p[1])), n: pairs.length});
  }
  const bestLag = lags.reduce((a, b) => (Math.abs(b.r) > Math.abs(a.r) ? b : a));
  const monthly = g.map((r) => ({month: label(r.k), t: r.t, ppb: r.ppb, trend: r.trend, growth: r.growth, slow: r.slow, fast: r.fast,
    oni: oni.get(r.k) ?? null, oni_lagged: oni.get(r.k - bestLag.lag) ?? null, phase: phase(oni.get(r.k - bestLag.lag) ?? 0)}));
  const series = ch4.map((r) => ({month: label(r.k), t: r.t, ppb: r.ppb, trend: r.trend}));
  const enso = [...oni].filter(([k]) => k >= ch4[0].k - 24).map(([k, v]) => ({month: label(k), t: Math.floor(k / 12) + (k % 12 + 0.5) / 12, oni: v, phase: phase(v)}));

  // radiative forcing (W/m²) relative to 1750: CO2 278 ppm, CH4 722 ppb, N2O 270 ppb
  const C0 = 278, M0 = 722, N0 = 270;
  const f = (M, N) => 0.47 * Math.log(1 + 2.01e-5 * (M * N) ** 0.75 + 5.31e-15 * M * (M * N) ** 1.52);
  const yearMean = (t, col) => { const m = new Map(); for (const r of rows(t)) { const v = num(r[col]); if (v == null) continue; const y = +r[0]; const a = m.get(y) || [0, 0]; a[0] += v; a[1]++; m.set(y, a); } return new Map([...m].filter(([, a]) => a[1] === 12).map(([y, a]) => [y, a[0] / 12])); };
  const co2 = yearMean(co2Text, 3), n2o = yearMean(n2oText, 3), ch4y = yearMean(chText, 3);
  const ch4F = (M) => 0.036 * (Math.sqrt(M) - Math.sqrt(M0)) - (f(M, N0) - f(M0, N0));
  // the years all three gases were measured globally all year (N2O from 2001)
  const forcing = [...ch4y].filter(([y]) => co2.has(y) && n2o.has(y)).map(([year, M]) => {
    const C = co2.get(year), N = n2o.get(year);
    return {year, co2_ppm: C, ch4_ppb: M, n2o_ppb: N,
      co2: 5.35 * Math.log(C / C0), ch4: ch4F(M), n2o: 0.12 * (Math.sqrt(N) - Math.sqrt(N0)) - (f(M0, N) - f(M0, N0))};
  });
  const first = forcing[0], last = forcing[forcing.length - 1];
  const rise = {from: first.year, to: last.year, co2: last.co2 - first.co2, ch4: last.ch4 - first.ch4, n2o: last.n2o - first.n2o};
  rise.ch4_share = rise.ch4 / (rise.co2 + rise.ch4 + rise.n2o);

  // eras of growth (annual)
  const mean = (a, b) => { const xs = annual.filter((r) => r.year >= a && r.year <= b).map((r) => r.growth); return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null; };
  const eras = [["1984–1999", 1984, 1999], ["the pause, 2000–2006", 2000, 2006], ["renewed rise, 2007–2019", 2007, 2019], ["the surge, 2020–2022", 2020, 2022], ["since 2023", 2023, 2100]]
    .map(([era, a, b]) => ({era, from: a, to: Math.min(b, annual[annual.length - 1].year), growth: mean(a, b)}));
  const enso_annual = annual.map((r) => { const v = [...Array(12)].map((_, i) => oni.get(month(r.year, i + 1) - bestLag.lag)).filter((x) => x != null);
    return {...r, oni: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null}; });
  // the budget, one box: dM/dt = E/2.75 − M/τ (2.75 Tg of CH4 per ppb; τ = 9.1 years, mostly OH in the air)
  const TG = 2.75, TAU = 9.1;
  const budget = annual.filter((r) => ch4y.has(r.year)).map((r) => {
    const M = ch4y.get(r.year), sink = TG * M / TAU;
    return {year: r.year, ppb: M, growth: r.growth, sink, emissions: sink + TG * r.growth, imbalance: TG * r.growth / sink};
  });
  // what follows from 2025's emissions: held, cut 30% by 2030 (the Global Methane Pledge's size), or rising 1% a year
  const b0 = budget[budget.length - 1];
  const scenarios = [["held at today's", () => 1], ["cut 30% by 2030, then held", (y) => 1 - 0.3 * Math.min(1, (y - b0.year) / (2030 - b0.year))], ["rising 1% a year", (y) => 1.01 ** (y - b0.year)]]
    .flatMap(([scenario, k]) => { let M = b0.ppb; const out = [{scenario, year: b0.year, ppb: M, forcing: ch4F(M)}];
      for (let y = b0.year; y < 2060; y++) { for (let i = 0; i < 12; i++) M += (b0.emissions * k(y + i / 12) / TG - M / TAU) / 12; out.push({scenario, year: y + 1, ppb: M, forcing: ch4F(M)}); }
      return out; });
  const steady = b0.emissions * TAU / TG;
  return {budget, scenarios, steady_ppb: steady, tau: TAU,
    latest: series[series.length - 1], annual: enso_annual, eras, monthly, series, enso, lags, best_lag: bestLag, forcing, rise};
})()