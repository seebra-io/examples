// Simulated powder patterns (Cu Kα1) of six cubic semiconductors from their COD cell edges.
// data[0]: peaks {material, hkl, class, two_theta_deg, d_A, intensity_pct, f_sq, multiplicity, link}
// data[1]: cells {material, a_A, spread_A, n_entries, file, link}
const [peaks, cells] = [data[0] || [], data[1] || []];
const order = cells.map(c => c.material);
const cell = new Map(cells.map(c => [c.material, c]));
const allowed = peaks.filter(d => d.f_sq > 0);
const missing = peaks.filter(d => d.f_sq === 0 && d.class === "even, h+k+l = 4n+2");
const label = m => { const c = cell.get(m); return c ? `${m}: a = ${c.a_A} Å (COD ${c.file}; ${c.n_entries} cubic entries, spread ${(+c.spread_A).toFixed(3)} Å)` : m; };
return plot({
  height: Math.max(480, (fit?.height ?? 560) - 20),
  marginTop: 20,
  fy: {domain: order, label: null, tickFormat: label, axis: null},
  x: {label: "2θ (degrees, Cu Kα1 λ = 1.5406 Å) →", domain: [20, 120], grid: true},
  y: {label: "↑ intensity (strongest = 100, log)", type: "symlog", domain: [0, 100], ticks: [0, 1, 10, 100]},
  color: {domain: ["all odd", "even, h+k+l = 4n", "even, h+k+l = 4n+2"], range: ["#0ea5e9", "#22c55e", "#ef4444"], legend: true, label: "reflection class"},
  marks: [
    // each facet's label in its top-left corner (a vertical facet axis can't sit on top)
    Plot.text(order, {fy: d => d, text: label, frameAnchor: "top-left", dx: 4, dy: 2, fontWeight: "bold", lineWidth: 90, stroke: "var(--plot-background)", strokeWidth: 3, paintOrder: "stroke"}),
    Plot.ruleX(allowed, {fy: "material", x: "two_theta_deg", y1: 0, y2: "intensity_pct", stroke: "class", strokeWidth: 2, tip: true, href: "link", target: "_blank",
      channels: {material: "material", hkl: "hkl", "d (Å)": "d_A", "θ (°)": "theta_deg", "|F|² (e²)": "f_sq", multiplicity: "multiplicity", class: "class"}}),
    Plot.text(allowed.filter(d => d.intensity_pct >= 3 || d.class === "even, h+k+l = 4n+2"), {fy: "material", x: "two_theta_deg", y: "intensity_pct", text: "hkl", dy: -7, fontSize: 9, fill: "currentColor"}),
    // where the (200), (222), ... would be: extinct in diamond-structure Si, Ge, C
    Plot.dot(missing, {fy: "material", x: "two_theta_deg", y: 0.3, symbol: "times", stroke: "#ef4444", r: 4, tip: true,
      channels: {hkl: "hkl", why: () => "extinct: |F|² = 16 (f_A − f_B)² = 0 when both atoms are the same"}}),
  ],
  caption: "Each line is a Bragg reflection; × marks where a (200)-type reflection is extinct. Notice (200) at about 32°: absent in Si, Ge and diamond (one kind of atom, the two halves of the basis cancel), "
    + "barely there in GaAs (Ga and As differ by 2 electrons, so f_A − f_B is small: about 0.1% of the strongest peak), strong in AlAs (13 against 33) and InP (49 against 15). That is how XRD tells zincblende from diamond, and an ordered compound from a mix. "
    + "Caveats: scattering factors are taken as Z (no fall-off with angle, no thermal motion), so high-angle peaks are too strong; real Si shows a weak (222) from its bond charge.",
});