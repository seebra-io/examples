// The 2MASS Redshift Survey (Huchra et al. 2012, ApJS 199, 26: every galaxy
// brighter than Ks = 11.75 at |b| > 5°, 8° toward the bulge), the part with
// a heliocentric velocity under 6,000 km/s, as HEASARC's Xamin serves it
// (table twomassrsc, | between columns). The distance is the velocity over
// H0 = 73 km/s/Mpc (as the UNGC uses): a redshift distance, not a measured one.
(() => {
  const H0 = 73;
  const lines = String(data ?? "").split(/\r?\n/).filter(l => l.includes("|"));
  if (!lines.length) return [];
  const head = lines[0].split("|").map(s => s.trim());
  const num = s => { const t = String(s ?? "").trim(); return t === "" || t === "null" ? null : +t; };
  return lines.slice(1).map(l => {
    const c = l.split("|").map(s => s.trim()), r = Object.fromEntries(head.map((h, k) => [h, c[k]]));
    const cz = num(r.radial_velocity), alt = r.alt_name && r.alt_name !== "null" ? r.alt_name.replace(/_+/g, " ").trim() : null;
    return {name: alt || r.name, id_2mass: r.name, l: num(r.lii), b: num(r.bii), ks: num(r.ks_mag_0_tot), morph_t: num(r.morph_type),
      cz_kms: cz, cz_err_kms: num(r.radial_velocity_error), dist_mpc: cz != null ? +(cz / H0).toFixed(2) : null,
      ned: `https://ned.ipac.caltech.edu/byname?objname=${encodeURIComponent(alt || r.name.replace(/^2MASS J/, "2MASX J"))}`};
  }).filter(r => r.l != null && r.cz_kms > 0);
})()