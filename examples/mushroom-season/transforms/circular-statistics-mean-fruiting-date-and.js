// Months are circular (December is next to January), so the season's centre is
// a mean direction: each month is an angle on the year's clock, weighted by its share.
// R (0..1) is how concentrated the season is; the circular SD sqrt(-2 ln R) is its spread.
// The effort-corrected direction weights by enrichment instead (share / all fungi's share).
// JavaScript, not SQL: SIN(2 * PI() * ...) inside SUM in a GROUP BY panics Polars 0.46
// ("should be a list at this point"), and the whole data runtime with it
(() => {
  const groups = new Map();
  for (const r of data) {
    const k = r.species;
    if (!groups.has(k)) groups.set(k, { species: r.species, latin: r.latin, taxon_key: r.taxon_key, records: 0, ss: 0, sc: 0, es: 0, ec: 0, e: 0 });
    const g = groups.get(k), a = 2 * Math.PI * (r.month - 0.5) / 12;
    g.records += r.records || 0;
    g.ss += r.share * Math.sin(a); g.sc += r.share * Math.cos(a);
    g.es += r.enrichment * Math.sin(a); g.ec += r.enrichment * Math.cos(a); g.e += r.enrichment;
  }
  const pos = (s, c) => (((Math.atan2(s, c) * 180 / Math.PI) + 360) % 360) / 30;
  return [...groups.values()].map((g) => ({
    species: g.species, latin: g.latin, taxon_key: g.taxon_key, records: g.records,
    mean_pos: pos(g.ss, g.sc), r: Math.hypot(g.ss, g.sc),
    corrected_pos: pos(g.es, g.ec), corrected_r: Math.hypot(g.es, g.ec) / g.e,
    link: "https://www.gbif.org/species/" + g.taxon_key,
    map: "https://www.gbif.org/occurrence/map?country=SE&year=2000,2025&taxon_key=" + g.taxon_key,
  }));
})()
