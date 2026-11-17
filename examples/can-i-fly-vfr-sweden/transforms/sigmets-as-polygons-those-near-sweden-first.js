// International SIGMETs (worldwide, NOAA's isigmet feed), one row per
// polygon. JavaScript, not Polars: the feed's coords field is a list of
// points for one area (geom AREA) and a list of such lists for several
// (AREAS), which no table column can hold. Each row gets its polygon as
// [[lon, lat], ...] for the map and its bounding box; near: the box touches
// 53-71°N, 3-33°E (Sweden's FIR ESAA and its neighbours EKDK, ENOR, EFIN,
// EETT, EVRR, EYVL, EPWW). Valid times in s since 1970 (UTC).
// A quiet day has none near: the rest of the world's show the feed is alive.
(Array.isArray(data) ? data : []).flatMap((s, i) => {
  const c = Array.isArray(s.coords) ? s.coords : [];
  const parts = Array.isArray(c[0]) ? c : [c];
  return parts.filter(p => p.length).map((p, part) => {
    const ring = p.map(q => [+q.lon, +q.lat]);
    const lons = ring.map(q => q[0]), lats = ring.map(q => q[1]);
    const box = {lon_min: Math.min(...lons), lon_max: Math.max(...lons), lat_min: Math.min(...lats), lat_max: Math.max(...lats)};
    return {i, part, fir: s.firId, fir_name: s.firName, office: s.icaoId, series: s.seriesId, hazard: s.hazard,
      qualifier: s.qualifier, base_ft: s.base, top_ft: s.top, valid_from: s.validTimeFrom, valid_to: s.validTimeTo,
      dir: s.dir, spd_kt: s.spd, change: s.chng, raw: s.rawSigmet, ...box,
      near: box.lat_max >= 53 && box.lat_min <= 71 && box.lon_max >= 3 && box.lon_min <= 33, ring};
  });
}).sort((a, b) => (b.near - a.near) || String(a.fir).localeCompare(String(b.fir)))