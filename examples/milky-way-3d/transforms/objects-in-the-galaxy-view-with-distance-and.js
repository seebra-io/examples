// The real objects drawn in the galaxy view: distance, how it was measured,
// the paper, and SIMBAD.
(() => (((data && data.objects) || []).map(o => ({name: o.name, kind: o.kind, l: o.l, b: o.b, dist_pc: o.dist_pc, dist_err_pc: o.dist_err_pc,
  dist_ly: Math.round(o.dist_pc * 3.26156), method: o.method, source: o.source, paper: o.url,
  simbad: "https://simbad.cds.unistra.fr/simbad/sim-id?Ident=" + encodeURIComponent(o.simbad || o.name)}))))()