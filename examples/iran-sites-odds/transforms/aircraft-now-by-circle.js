// Aircraft that adsb.lol's volunteer receivers see now within 250 nautical
// miles (463 km) of three points: north-west Iran (Tehran), central Iran,
// and the Gulf for comparison. Few or none over Iran beside a busy Gulf is
// what a closed airspace looks like; receivers are sparse in Iran, so an
// empty circle can also be missing coverage. Altitude in feet, speed in
// knots (aviation units). Inputs: the three answers, in that order.
(() => {
const ZONES = ["Iran north-west (Tehran)", "Iran centre", "Gulf (comparison)"];
const answers = Array.isArray(data) ? data : [data];
const seen = new Set(), out = [];
answers.forEach((a, i) => {
  for (const p of (a && Array.isArray(a.ac) ? a.ac : [])) {
    if (p.lat == null || p.lon == null || seen.has(p.hex)) continue;
    seen.add(p.hex);
    out.push({zone: ZONES[i] || "zone " + (i + 1), callsign: String(p.flight || "").trim() || null, registration: p.r || null, type: p.t || null,
              lat: p.lat, lon: p.lon, on_ground: p.alt_baro === "ground", altitude_ft: typeof p.alt_baro === "number" ? p.alt_baro : null,
              speed_kt: p.gs != null ? Math.round(p.gs) : null, track: p.track ?? null, seen_s_ago: p.seen ?? null,
              time: a.now ? new Date(a.now).toISOString().slice(11, 16) + " UTC" : null});
  }
});
// the count per circle, so an empty one still shows (as 0)
const counts = ZONES.slice(0, answers.length).map(z => ({zone: z, aircraft: out.filter(p => p.zone === z && !p.on_ground).length}));
return {counts, aircraft: out};
})()
