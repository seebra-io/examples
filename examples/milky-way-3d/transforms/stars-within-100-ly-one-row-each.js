// HYG's rows as objects, with the distance in light years, the spectral class
// and SIMBAD's page for each star.
(() => {
  // "dM4" is a dwarf M, lower-case "m" or "k-m" Gliese's rough class from colour, "DA2" or "WD" a white dwarf
  const clsOf = sp => { let s = String(sp || "").trim(); if (/^(WD|D[ABCOQZX0-9]|D$)/.test(s)) return "D"; s = s.replace(/^(sd|d)(?=[A-Za-z])/, ""); const c = (s[0] || "?").toUpperCase(); return c === "T" ? "L" : "OBAFGKML".includes(c) ? c : "?"; };
  const d = data || {};
  const rows = Array.isArray(d.rows) ? d.rows.map(r => Object.fromEntries(d.fields.map((f, k) => [f, r[k]]))) : [];
  return rows.map(r => ({name: r.name, dist_ly: +(r.dist_pc * 3.26156).toFixed(2), dist_pc: r.dist_pc, spect: r.spect || null,
    class: clsOf(r.spect), mag: r.mag, absmag: r.absmag, lum_v: r.lum_v,
    simbad: "https://simbad.cds.unistra.fr/simbad/sim-id?Ident=" + encodeURIComponent(r.simbad_id || r.name)}));
})()