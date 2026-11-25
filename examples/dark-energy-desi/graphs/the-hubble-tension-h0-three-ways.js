// The Hubble tension: how fast is the universe expanding today? The
// distance ladder (Cepheid variables calibrate 77 nearby supernovae, which
// calibrate the rest) says about 73 km/s/Mpc; the sound-wave ruler, whose
// length r_d comes from early-universe physics, says 67–69. The gap is
// several times either error, and evolving dark energy (which changes
// late distances) doesn't close it. Faint dots: the value each
// Hubble-flow supernova gives on its own.
const s = data || {};
const h = s.h0 || [];
const short = ["Distance ladder (Pantheon+SH0ES)", "BAO + CMB θ* with Planck's r_d", "Planck CMB, ΛCDM"];
const rows = h.map((r, i) => ({...r, label: short[i]}));
return plot({
  height: Math.max(320, (fit?.height ?? 480) - 30), marginLeft: 230, marginRight: 30,
  x: {domain: [60, 85], label: "H0 (km/s per megaparsec) →", grid: true},
  y: {domain: short, label: null},
  marks: [
    Plot.dot(s.ladder || [], {x: "h0", y: () => short[0], dy: 26, r: 1.4, fill: "#a1a1aa", fillOpacity: 0.35, tip: true, channels: {supernova: "id", z: "z"}}),
    Plot.ruleY(rows.filter((r) => r.err), {y: "label", x1: (r) => r.h0 - r.err, x2: (r) => r.h0 + r.err, stroke: (r, i) => i === 0 ? "#f97316" : "#60a5fa", strokeWidth: 3}),
    Plot.dot(rows, {x: "h0", y: "label", r: 6, fill: (r, i) => i === 0 ? "#f97316" : "#60a5fa", tip: true, channels: {method: "method", note: "note"}}),
    Plot.text(rows, {x: "h0", y: "label", text: (r) => `${r.h0.toFixed(1)}${r.err ? ` ± ${r.err.toFixed(1)}` : ""}`, dy: -14, fontWeight: 600}),
  ],
  caption: "Ladder: MU_SH0ES of supernovae at 0.023 < z < 0.15, ΛCDM shape; error statistical only (SH0ES's full analysis: 73.0 ± 1.0). Planck: published value.",
});