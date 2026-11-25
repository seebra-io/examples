// Every confident compact-binary merger LIGO, Virgo and KAGRA have
// published, as GWOSC's cumulative catalogue lists it (each event's latest
// version, GWTC-1 to GWTC-5.0): masses in the source frame (the median and
// the 90% interval), final mass, effective spin, distance, signal-to-noise,
// and the observing run it fell in. Derived: what kind of pair it was (by
// the lighter and heavier mass), the energy radiated as gravitational
// waves (the masses before minus the mass after), and whether a mass falls
// in one of the two "gaps" stellar physics predicts. data: GWOSC's GWTC
// JSON.
(() => {
  const ev = Object.values(data?.events || {});
  const MSUN_J = 1.787e47; // one solar mass as energy, mc² (J)
  // observing runs (UTC start, end); O4a and O4b from the engineering runs just before them, whose events the catalogues include
  const RUNS = [["O1", "2015-09-12", "2016-01-19"], ["O2", "2016-11-30", "2017-08-25"], ["O3a", "2019-04-01", "2019-10-01"],
                ["O3b", "2019-11-01", "2020-03-27"], ["O4a", "2023-05-15", "2024-01-16"], ["O4b", "2024-04-01", "2025-01-28"], ["O4c", "2025-01-28", "2025-11-18"]];
  const gpsToDate = (g) => new Date(Date.UTC(1980, 0, 6) + (g - 18) * 1000); // GPS was 18 s ahead of UTC since 2017 (17 before): close enough for a date
  const runOf = (d) => (RUNS.find(([, a, b]) => d >= new Date(a) && d <= new Date(b + "T23:59:59Z")) || ["between runs"])[0];
  const v = (e, k) => e[k] == null ? null : +e[k];
  const LOWER_GAP = [2.5, 5], PI_GAP = [60, 130]; // M☉; both edges are uncertain
  const inGap = (m, [a, b]) => m != null && m >= a && m <= b;
  const events = ev.map((e) => {
    const date = gpsToDate(+e.GPS);
    const m1 = v(e, "mass_1_source"), m2 = v(e, "mass_2_source"), tot = v(e, "total_mass_source"), fin = v(e, "final_mass_source");
    const kind = m1 == null ? "no parameters yet" : m1 < 3 ? "two neutron stars" : m2 < 3 ? "neutron star + black hole" : "two black holes";
    const erad = tot != null && fin != null ? tot - fin : null;
    return {
      name: e.commonName, catalog: e["catalog.shortName"], date: date.toISOString().slice(0, 10), t: date.getUTCFullYear() + (date - Date.UTC(date.getUTCFullYear(), 0, 1)) / 31557600000,
      run: runOf(date), kind,
      m1, m1_lo: m1 == null ? null : m1 + (v(e, "mass_1_source_lower") ?? 0), m1_hi: m1 == null ? null : m1 + (v(e, "mass_1_source_upper") ?? 0),
      m2, m2_lo: m2 == null ? null : m2 + (v(e, "mass_2_source_lower") ?? 0), m2_hi: m2 == null ? null : m2 + (v(e, "mass_2_source_upper") ?? 0),
      total: tot, final: fin, chirp: v(e, "chirp_mass_source"), q: m1 && m2 ? m2 / m1 : null,
      chi_eff: v(e, "chi_eff"), chi_lo: e.chi_eff == null ? null : +e.chi_eff + (v(e, "chi_eff_lower") ?? 0), chi_hi: e.chi_eff == null ? null : +e.chi_eff + (v(e, "chi_eff_upper") ?? 0),
      distance_mpc: v(e, "luminosity_distance"), redshift: v(e, "redshift"), snr: v(e, "network_matched_filter_snr"), p_astro: v(e, "p_astro"),
      radiated_msun: erad, radiated_j: erad == null ? null : erad * MSUN_J, radiated_share: erad != null && tot ? erad / tot : null,
      lower_gap: inGap(m1, LOWER_GAP) || inGap(m2, LOWER_GAP), pi_gap: inGap(m1, PI_GAP) || inGap(m2, PI_GAP),
      link: `https://gwosc.org/eventapi/html/GWTC/${e.commonName}/`,
    };
  }).sort((a, b) => a.t - b.t);
  const withM = events.filter((e) => e.m1 != null);
  const runs = RUNS.map(([run, a, b]) => {
    const days = (new Date(b) - new Date(a)) / 864e5, n = events.filter((e) => e.run === run).length;
    return {run, from: a, to: b, days, events: n, per_week: n / days * 7, published: n > 0};
  });
  const count = (f) => withM.filter(f).length;
  const median = (xs) => { const s = xs.filter((x) => x != null).sort((a, b) => a - b); return s.length ? (s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2 : null; };
  const chis = withM.map((e) => e.chi_eff).filter((x) => x != null);
  const biggest = [...withM].sort((a, b) => (b.radiated_msun ?? 0) - (a.radiated_msun ?? 0))[0];
  return {
    events, runs,
    summary: {events: events.length, with_parameters: withM.length,
      bbh: count((e) => e.kind === "two black holes"), nsbh: count((e) => e.kind === "neutron star + black hole"), bns: count((e) => e.kind === "two neutron stars"),
      lower_gap: withM.filter((e) => e.lower_gap).map((e) => e.name), pi_gap: withM.filter((e) => e.pi_gap).map((e) => e.name),
      median_m1: median(withM.map((e) => e.m1)), median_share: median(withM.map((e) => e.radiated_share)),
      radiated_total_msun: withM.reduce((s, e) => s + (e.radiated_msun || 0), 0),
      biggest: biggest && {name: biggest.name, radiated_msun: biggest.radiated_msun, total: biggest.total},
      chi_mean: chis.reduce((a, b) => a + b, 0) / chis.length, chi_negative: chis.filter((x) => x < 0).length, chi_n: chis.length,
      catalogs: [...new Set(events.map((e) => e.catalog))]},
    gaps: {lower: LOWER_GAP, pair_instability: PI_GAP},
    selected: "{{event}}",
  };
})()