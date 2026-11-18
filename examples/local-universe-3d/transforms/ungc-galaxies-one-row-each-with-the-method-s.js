// The Updated Nearby Galaxy Catalog (Karachentsev, Makarov & Kaisina 2013,
// AJ 145, 101; 869 galaxies with individual distances within ~11 Mpc), as
// HEASARC's Xamin serves it (table neargalcat): text with | between columns,
// a header row and a row count at the end. One row per galaxy, with the
// distance method's typical error where the catalogue's paper states one.
(() => {
  const text = String(data ?? "");
  const lines = text.split(/\r?\n/).filter(l => l.includes("|"));
  if (!lines.length) return [];
  const head = lines[0].split("|").map(s => s.trim());
  const num = s => { const t = String(s ?? "").trim(); return t === "" || t === "null" ? null : +t; };
  // typical errors per method, from the paper's text (section 2): TRGB ~5%,
  // Cepheids and supernovae 5-10%, Tully-Fisher and fundamental plane 20-25%,
  // brightest stars no better than 25%; the others are not given a number
  const ERR = {TRGB: [0.05, "~5%"], Cep: [0.075, "5–10%"], SN: [0.075, "5–10%"], TF: [0.22, "20–25%"], FP: [0.22, "20–25%"], BS: [0.25, "≥25%"]};
  const METHOD = {TRGB: "tip of the red giant branch", Cep: "Cepheid variables", SN: "supernova", TF: "Tully–Fisher (rotation vs luminosity)", FP: "fundamental plane",
    BS: "brightest stars", SBF: "surface brightness fluctuations", HB: "horizontal branch", RR: "RR Lyrae stars", CMD: "colour–magnitude diagram", PNLF: "planetary nebula luminosity function",
    mem: "membership of a group with a known distance", h: "Hubble flow (V_LG / 73 km/s/Mpc)", "h'": "Hubble flow, corrected for the Virgo infall", txt: "texture (how resolved it looks): a rough guess", geom: "geometry (our own galaxy)"};
  const TYPE = t => t == null ? "?" : t <= -4 ? "elliptical" : t <= -1 ? "lenticular (S0)" : t <= 1 ? "Sa" : t <= 3 ? "Sb" : t <= 6 ? "Sc" : t <= 8 ? "Sd/Sdm" : t === 9 ? "Magellanic spiral (Sm)" : "irregular (Im)";
  return lines.slice(1).map(l => {
    const c = l.split("|").map(s => s.trim()), r = Object.fromEntries(head.map((h, k) => [h, c[k]]));
    const d = num(r.distance), m = r.distance_method || "", e = ERR[m];
    const T = num(r.morph_type), dw = r.dwarf_morph_type && r.dwarf_morph_type !== "null" ? r.dwarf_morph_type : null;
    return {
      name: r.name, l: num(r.lii), b: num(r.bii), dist_mpc: d, method: m, method_name: METHOD[m] || m,
      typical_error: e ? e[1] : "not stated", err_mpc: e && d != null ? +(d * e[0]).toFixed(2) : null,
      morph_t: T, type: dw ? `dwarf ${dw}` : TYPE(T), log_lk: num(r.log_ks_luminosity), abs_b: num(r.abs_bmag),
      v_helio: num(r.radial_velocity), v_lg: num(r.lg_radial_velocity), diameter_kpc: num(r.linear_diameter), log_mass: num(r.log_mass_26), log_hi_mass: num(r.log_h1_mass),
      tidal_index: num(r.tidal_index_1), main_neighbour: r.neighbor_galaxy_name && r.neighbor_galaxy_name !== "null" ? r.neighbor_galaxy_name : null,
      ned: `https://ned.ipac.caltech.edu/byname?objname=${encodeURIComponent(r.name)}`,
    };
  }).filter(r => r.name && r.name !== "Number of rows:" && r.l != null && r.dist_mpc != null);
})()