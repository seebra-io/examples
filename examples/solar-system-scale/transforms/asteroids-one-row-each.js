// One row per asteroid from the SBDB query answer ({fields, data}); both
// queries (numbered asteroids, Jupiter trojans), without duplicates.
(() => {
  const seen = new Set();
  const name = {MBA: "main belt", IMB: "main belt", OMB: "outer main belt", MCA: "Mars-crosser", TJN: "Jupiter trojan", APO: "near-Earth", ATE: "near-Earth", AMO: "near-Earth", CEN: "centaur"};
  return data.flatMap(d => (d && Array.isArray(d.data) ? d.data.map(r => Object.fromEntries(d.fields.map((f, k) => [f, r[k]]))) : []))
    .filter(r => r.full_name && !seen.has(r.full_name) && seen.add(r.full_name))
    .map(r => ({name: String(r.full_name).trim(), a: +r.a, e: +r.e, i: +r.i, class: r.class, group: name[r.class] || r.class,
                period_years: +(Math.pow(+r.a, 1.5)).toFixed(2), perihelion_au: +((+r.a) * (1 - +r.e)).toFixed(3), aphelion_au: +((+r.a) * (1 + +r.e)).toFixed(3)}));
})()