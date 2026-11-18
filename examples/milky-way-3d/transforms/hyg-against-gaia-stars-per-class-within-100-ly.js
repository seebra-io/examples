// How many stars each census finds within 100 ly, per class: HYG by catalogued
// spectral type, Gaia DR3 by BP-RP colour (a rough guess at the class). The gap
// in M is the faint red dwarfs older catalogues missed.
(() => {
  const [hyg, gaia] = data;
  const byColour = c => c == null ? "?" : c < -0.1 ? "B" : c < 0.35 ? "A" : c < 0.75 ? "F" : c < 0.98 ? "G" : c < 1.8 ? "K" : c < 4.5 ? "M" : "L";
  const count = (xs, key) => { const m = new Map(); for (const x of xs) { const k = key(x); m.set(k, (m.get(k) || 0) + 1); } return m; };
  const h = count(Array.isArray(hyg) ? hyg : [], r => r.class);
  // white dwarfs lie far below the main sequence; fainter than G = 19 the colours are unreliable
  const gaiaClass = r => { const c = r.bp_rp == null || r.bp_rp === "" ? null : +r.bp_rp, g = +r.phot_g_mean_mag, absg = g + 5 * Math.log10(+r.parallax / 100); return c == null || g > 19 ? "?" : absg > 10 + 2.2 * c ? "D" : byColour(c); };
  const g = count(Array.isArray(gaia) ? gaia : [], gaiaClass);
  return ["O", "B", "A", "F", "G", "K", "M", "L", "D", "?"].map(c => ({class: c, hyg: h.get(c) || 0, gaia_by_colour: g.get(c) || 0}))
    .filter(r => r.hyg || r.gaia_by_colour);
})()