// Each flyby estimated from the orbits: the object's and Earth's
// heliocentric positions by two-body Kepler motion, every 2 hours for 4 days
// either side of JPL's approach time, the difference in lunar distances
// (geocentric ecliptic J2000; x towards the vernal equinox, z to the
// ecliptic north). Earth is the Earth-Moon barycentre from JPL's approximate
// planet elements (Standish, valid 1800-2050). An estimate: no planets'
// pull, no Moon, so it drifts from JPL's integrated value; the check step
// says by how much.
(() => {
const rad = Math.PI / 180, K = 0.01720209895, AU_KM = 149597870.7, LD_KM = 384400, LD = AU_KM / LD_KM;
const kepler = (M, e) => { let E = e < 0.8 ? M : Math.PI; for (let k = 0; k < 50; k++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-12) break; } return E; };
// a (au), e, i, om (node), w (perihelion), M (mean anomaly), all angles in degrees
const position = (a, e, i, om, w, M) => {
  const E = kepler(((M % 360) + 360) % 360 * rad, e);
  const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const [O, W, I] = [om * rad, w * rad, i * rad];
  const cO = Math.cos(O), sO = Math.sin(O), cW = Math.cos(W), sW = Math.sin(W), cI = Math.cos(I), sI = Math.sin(I);
  return [(cO * cW - sO * sW * cI) * xp + (-cO * sW - sO * cW * cI) * yp,
          (sO * cW + cO * sW * cI) * xp + (-sO * sW + cO * cW * cI) * yp,
          (sW * sI) * xp + (cW * sI) * yp];
};
const earth = jd => {
  const T = (jd - 2451545.0) / 36525;
  const a = 1.00000261 + 0.00000562 * T, e = 0.01671123 - 0.00004392 * T, i = -0.00001531 - 0.01294668 * T;
  const L = 100.46457166 + 35999.37244981 * T, peri = 102.93768193 + 0.32327364 * T, om = 0;
  return position(a, e, i, om, peri - om, L - peri);
};
const object = (o, jd) => position(o.a, o.e, o.i, o.om, o.w, o.ma + (K / Math.pow(o.a, 1.5)) * (jd - o.epoch) / rad);
const out = [];
for (const o of (Array.isArray(data) ? data : []).filter(o => o.has_orbit)) {
  for (let h = -96; h <= 96; h += 2) {
    const jd = o.jd + h / 24, p = object(o, jd), g = earth(jd);
    const x = (p[0] - g[0]) * LD, y = (p[1] - g[1]) * LD, z = (p[2] - g[2]) * LD;
    out.push({ name: o.name, hours: h, x: +x.toFixed(4), y: +y.toFixed(4), z: +z.toFixed(4),
               r_ld: +Math.hypot(x, y, z).toFixed(4), jpl_ld: o.dist_ld, size_m: o.size_m, v_rel_kms: o.v_rel_kms, date: o.date });
  }
}
return out;
})()
