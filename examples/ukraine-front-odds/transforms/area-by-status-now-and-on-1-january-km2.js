// Area held by status now and in the baseline snapshot (the first of 2026),
// in km², from the polygons' outlines (equal-area on the sphere, holes
// subtracted). "occupied" is the change since 2022; "occupied since 2014"
// is Crimea and parts of Donetsk and Luhansk. The difference is net: gains
// and losses in different places cancel. Inputs: 0 now, 1 baseline.
(() => {
const R = 6371.0088, rad = Math.PI / 180;
// spherical polygon ring area (km²), by the line-integral formula; sign by winding
const ring = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += (x2 - x1) * rad * (2 + Math.sin(y1 * rad) + Math.sin(y2 * rad)); } return s * R * R / 2; };
const polygon = rings => rings.reduce((a, r, i) => a + (i === 0 ? 1 : -1) * Math.abs(ring(r)), 0);
const area = g => g.type === "Polygon" ? polygon(g.coordinates) : g.coordinates.reduce((a, p) => a + polygon(p), 0);
const [now = {}, base = {}] = Array.isArray(data) ? data : [];
const total = (snap, s) => (snap.areas || []).filter(a => a.status === s).reduce((t, a) => t + area(a.geometry), 0);
return ["occupied", "occupied since 2014", "status unknown"].map(s => {
  const n = total(now, s), b = total(base, s);
  return {status: s, km2_now: Math.round(n), km2_baseline: Math.round(b), change_km2: Math.round(n - b),
          now: now.snapshot, baseline: base.snapshot};
});
})()
