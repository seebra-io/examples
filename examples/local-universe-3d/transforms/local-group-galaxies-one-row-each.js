// McConnachie's Local Group (2021 update) plus the Milky Way and M31: distance
// with its error range, V luminosity, velocity, and NED.
(() => (((data && data.local_group) || []).map(g => ({name: g.name, l: g.l, b: g.b, dist_kpc: g.dist_kpc, dist_kpc_lo: g.dist_kpc_lo, dist_kpc_hi: g.dist_kpc_hi,
  abs_v: g.abs_v, lum_v_lsun: g.lum_v_lsun, vh_kms: g.vh_kms, feh: g.feh, source: g.source,
  ned: "https://ned.ipac.caltech.edu/byname?objname=" + encodeURIComponent(g.name.replace(/ \(M31\)$/, ""))}))).sort((a, b) => a.dist_kpc - b.dist_kpc))()