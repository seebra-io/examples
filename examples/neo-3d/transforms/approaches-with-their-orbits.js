// JPL's close approaches (CAD) joined to their orbits (SBDB): one row per
// approach with JPL's nominal distance, its 3-sigma range and the object's
// osculating elements (heliocentric ecliptic J2000; a in au, angles in degrees).
// Both answers are {fields, data: [[...]]}; inputs: 0 cad, 1 orbits.
(() => {
const [cad = {}, orb = {}] = Array.isArray(data) ? data : [];
const rows = t => (t.data || []).map(r => Object.fromEntries((t.fields || []).map((f, i) => [f, r[i]])));
const num = v => v == null || v === "" ? null : +v;
const elements = new Map(rows(orb).map(o => [String(o.pdes).trim(), o]));
const AU_KM = 149597870.7, LD_KM = 384400;
return rows(cad).map(c => {
  const o = elements.get(String(c.des).trim());
  return {
    name: String(c.fullname || c.des).trim().replace(/^\((.*)\)$/, "$1"),
    des: c.des,
    date: c.cd,
    jd: num(c.jd),
    dist_ld: +(num(c.dist) * AU_KM / LD_KM).toFixed(3),
    dist_min_ld: +(num(c.dist_min) * AU_KM / LD_KM).toFixed(3),
    dist_max_ld: +(num(c.dist_max) * AU_KM / LD_KM).toFixed(3),
    v_rel_kms: +num(c.v_rel).toFixed(2),
    time_sigma: c.t_sigma_f,
    h_mag: num(c.h),
    diameter_km: num(c.diameter),
    // without a measured diameter: from H at an albedo of 0.14 (D = 1329 km / sqrt(p) * 10^(-H/5))
    size_m: Math.round(num(c.diameter) != null ? num(c.diameter) * 1000 : 1329000 / Math.sqrt(0.14) * Math.pow(10, -num(c.h) / 5)),
    has_orbit: !!o,
    a: o ? num(o.a) : null, e: o ? num(o.e) : null, i: o ? num(o.i) : null,
    om: o ? num(o.om) : null, w: o ? num(o.w) : null, ma: o ? num(o.ma) : null,
    epoch: o ? num(o.epoch) : null, moid_ld: o && o.moid != null ? +(num(o.moid) * AU_KM / LD_KM).toFixed(3) : null,
    url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=" + encodeURIComponent(c.des),
  };
});
})()
