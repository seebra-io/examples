// DeepStateMap's map of Ukraine on 31 December 2025 (the baseline), kept to Ukraine and the
// Black Sea and sorted into what the map draws: areas by status (occupied;
// occupied since 2014: Crimea and the "CADR/CALR"; liberated; status
// unknown, the grey zone), its markers of attack directions, the Russian
// and Belarusian units it places (brigades, regiments, divisions, volunteer
// formations: where DeepState last put them, from its own and open
// sources; not verified here) and military airfields. Its joke and insult
// labels are left out. Names are DeepState's (Ukrainian /// English); the
// English part is kept. Coordinates are lon, lat (the height dropped).
(() => {
const BOX = {w: 21.5, e: 41.5, s: 43.5, n: 53.5};
const UNIT_KIND = t => (t.match(/units\.([a-z]+)/) || [])[1];
const fc = data && data.map ? data.map : data || {};
const tagOf = n => (String(n).match(/geoJSON\.[a-z_.]+/i) || [""])[0];
const english = n => { const parts = String(n).split("///").map(s => s.trim()).filter(Boolean); return (parts.length > 1 ? parts[1] : parts[0] || "").replace(/geoJSON\.[a-z_.]+/i, "").trim(); };
const flat = c => typeof c[0] === "number" ? [c[0], c[1]] : c.map(flat);
const inBox = g => { const pts = JSON.stringify(g.coordinates).match(/-?\d+\.?\d*,-?\d+\.?\d*/g) || []; return pts.some(p => { const [x, y] = p.split(",").map(Number); return x > BOX.w && x < BOX.e && y > BOX.s && y < BOX.n; }); };
const status = t => /status\.occupied/.test(t) ? "occupied" : /territories\.(crimea|ordlo|tuzla)/.test(t) ? "occupied since 2014"
  : /status\.dismissed/.test(t) ? "liberated" : /status\.unkno/.test(t) ? "status unknown" : null;
const areas = [], attacks = [], units = [], airfields = [];
for (const f of fc.features || []) {
  const g = f.geometry; if (!g || !inBox(g)) continue;
  const name = f.properties && f.properties.name, tag = tagOf(name);
  if (g.type === "Point") {
    const [lon, lat] = flat(g.coordinates);
    const note = String(f.properties.description || "").replace(/\{icon=[^}]*\}/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 240);
    if (/status\.attack_direction/.test(tag)) attacks.push({lon, lat, name: english(name)});
    else if (/^geoJSON\.units\./.test(tag) && !/pidors/.test(tag)) units.push({lon, lat, name: english(name), kind: UNIT_KIND(tag) || "unit", belarus: /belarus/.test(tag), note});
    else if (/^geoJSON\.(airfield|airport|airbase)\./.test(tag)) airfields.push({lon, lat, name: english(name), note});
  } else if (/Polygon/.test(g.type)) {
    const s = status(tag); if (!s) continue;
    areas.push({status: s, name: english(name), geometry: {type: g.type, coordinates: flat(g.coordinates)}});
  }
}
return {snapshot: "2025-12-31 17:03 UTC", // the query's snapshot id 1767200597; change both to compare with another day
        source: "DeepStateMap.Live", areas, attacks, units, airfields};
})()
