// Gaia DR3's own census of the sphere of 100 light years, live: every source
// with a parallax better than 10% (about 10,000), on a colour–magnitude
// (Hertzsprung–Russell) diagram. Absolute G = G + 5 log10(parallax / 100 mas),
// no extinction (negligible this close). The main sequence runs from the few
// hot stars at top left to the crowd of red dwarfs bottom right; the white
// dwarfs sit apart below it; brown dwarfs are too faint in G to show much.
// Hover a star for its numbers; click it for SIMBAD.
// data: Gaia DR3 rows (CSV)
const rows = (Array.isArray(data) ? data : []).filter(r => +r.parallax > 0 && r.bp_rp != null && r.bp_rp !== "" && r.phot_g_mean_mag != null)
  .map(r => ({id: String(r.designation || "").replace(/^Gaia DR3 /, ""), bp_rp: +r.bp_rp, g: +r.phot_g_mean_mag, plx: +r.parallax, ly: 1000 / +r.parallax * 3.26156, absg: +r.phot_g_mean_mag + 5 * Math.log10(+r.parallax / 100)}));
if (!rows.length) {
  const d = document.createElement("div");
  d.style.cssText = "padding:16px;font:13px system-ui,sans-serif;color:#a1a1aa";
  d.textContent = typeof data === "string" ? "The Gaia archive sent no table (it may be down for maintenance: try again later). The 3D slides do not need it." : "No Gaia rows yet.";
  return d;
}
const band = r => r.absg > 10 + 2.2 * r.bp_rp ? (r.g > 19 ? "faint: colour unreliable" : "white dwarf (below the main sequence)") : r.bp_rp > 1.8 ? "red dwarf (M)" : r.bp_rp > 0.98 ? "orange (K)" : r.bp_rp > 0.75 ? "yellow (G)" : "hotter (F, A, B)";
return plot({
  marginLeft: 50, marginTop: 30, marginBottom: 40,
  x: {label: "colour BP − RP (mag) → redder, cooler", grid: true},
  y: {label: "↑ brighter: absolute G magnitude", reverse: true, grid: true},
  color: {legend: true, domain: ["hotter (F, A, B)", "yellow (G)", "orange (K)", "red dwarf (M)", "white dwarf (below the main sequence)", "faint: colour unreliable"], range: ["#cad7ff", "#fff4ea", "#ffd2a1", "#ff9b5c", "#7dd3fc", "#71717a"]},
  marks: [
    Plot.dot(rows, {x: "bp_rp", y: "absg", r: 1.6, fill: band, fillOpacity: 0.7, channels: {"Gaia DR3": "id", "light years": d => d.ly.toFixed(1), "parallax (mas)": d => d.plx.toFixed(2), G: d => d.g.toFixed(2)},
      tip: {format: {x: d => d.toFixed(2), y: d => d.toFixed(2), fill: true}}, href: d => `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent("Gaia DR3 " + d.id)}`}),
    Plot.text([{x: 0.82, y: 4.67}], {x: "x", y: "y", text: () => "the Sun would sit here", fill: "#fde047", dx: 8, textAnchor: "start"}),
    Plot.dot([{x: 0.82, y: 4.67}], {x: "x", y: "y", r: 4, stroke: "#fde047"}),
  ],
  caption: `${rows.length.toLocaleString()} Gaia DR3 sources within 100 ly (parallax > 32.6 mas, parallax/error > 10), live from ESA's archive. HYG lists ${"4,048"} stars in the same sphere: most of the difference is faint red dwarfs. Colour classes are a rough guess from BP − RP. The grey band near absolute G 18 is not a sequence of stars: these sources are fainter than G = 19, where Gaia's BP and RP fluxes are noisy and blended (Riello et al. 2021, A&A 649, A3), so their colours can't be trusted. The Sun: absolute G ≈ 4.67, BP − RP ≈ 0.82 (Casagrande & VandenBerg 2018).`,
});