// USGS's events of magnitude 2.5 and up in the region since mid-September,
// each with the nearest followed site and its distance (great circle). Iran
// is very active seismically, so nearly all are earthquakes; USGS calls an
// event an explosion only when it knows (the type column). A shallow, small
// event near a site is a reason to look further, not evidence.
// Inputs: 0 the USGS answer (GeoJSON), 1 sites.
(() => {
const [q = {}, sites = []] = Array.isArray(data) ? data : [];
const R = 6371, rad = Math.PI / 180;
const km = (a, b, c, d) => 2 * R * Math.asin(Math.sqrt(Math.sin((c - a) * rad / 2) ** 2 + Math.cos(a * rad) * Math.cos(c * rad) * Math.sin((d - b) * rad / 2) ** 2));
return (q.features || []).map(f => {
  const [lon, lat, depth] = f.geometry.coordinates, p = f.properties;
  const near = sites.map(s => ({s, d: km(lat, lon, s.lat, s.lon)})).sort((a, b) => a.d - b.d)[0];
  return {time: new Date(p.time).toISOString().slice(0, 16).replace("T", " "), mag: p.mag, depth_km: depth, type: p.type, place: p.place,
          lat, lon, nearest_site: near ? near.s.name : null, km_to_site: near ? Math.round(near.d) : null, url: p.url};
}).sort((a, b) => b.time.localeCompare(a.time));
})()
