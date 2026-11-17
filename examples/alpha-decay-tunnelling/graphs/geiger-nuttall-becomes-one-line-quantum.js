// Half-lives of α emitters against the raw Geiger–Nuttall variable and against Gamow's tunnelling exponent.
// data[0]: panels {panel, xv, log_t, nuclide, z, parity, half_life, unit_hl, q_mev, link}; data[1]: fit per parity {parity, slope, intercept, residual_sd_dex, decades}
const [rows, fits] = data;
const panels = ["Geiger–Nuttall: Z_d/√Q", "Gamow: tunnelling exponent 2G/ln 10"];
const ee = fits.find(f => f.parity === "even–even");
const g = rows.filter(d => d.panel === panels[1]);
const [lo, hi] = d3.extent(g, d => d.xv);
const line = [{panel: panels[1], xv: lo, y: ee.intercept + ee.slope * lo}, {panel: panels[1], xv: hi, y: ee.intercept + ee.slope * hi}];
const ticks = [[-15, "1 fs"], [-9, "1 ns"], [-3, "1 ms"], [0, "1 s"], [3.56, "1 h"], [7.5, "1 yr"], [16.5, "age of the Universe"]];
return plot({
  height: Math.max(420, (fit?.height ?? 480) - 40),
  marginTop: 24, marginRight: 110,
  fx: {label: null, domain: panels},
  x: {label: "Z_d/√(Q/MeV)  ·  or  ·  2G/ln 10 from the barrier →", grid: true},
  y: {label: "↑ log₁₀ half-life (s)", grid: true},
  color: {type: "linear", scheme: "viridis", legend: true, label: "proton number Z"},
  marks: [
    Plot.ruleY(ticks.flatMap(t => panels.map(panel => ({panel, y: t[0]}))), {fx: "panel", y: "y", stroke: "currentColor", strokeOpacity: 0.15}),
    Plot.text(ticks.map(t => ({panel: panels[1], y: t[0], label: t[1]})), {fx: "panel", y: "y", text: "label", frameAnchor: "right", dx: 6, textAnchor: "start", fill: "currentColor", fillOpacity: 0.6}),
    Plot.line(line, {fx: "panel", x: "xv", y: "y", stroke: "#f97316", strokeWidth: 2}),
    Plot.dot(rows, {fx: "panel", x: "xv", y: "log_t", fill: "z", r: d => d.parity === "even–even" ? 3 : 1.8, fillOpacity: 0.8, href: "link", target: "_blank", tip: true,
      channels: {nuclide: "nuclide", "half-life": d => `${d.half_life} ${d.unit_hl}`, "Q_α (MeV)": "q_mev", parity: "parity", "2G/ln 10": "gamow_log10"}}),
  ],
  caption: `Left, Geiger and Nuttall's 1911 view: each element's isotopes make their own line, and the lines don't meet. Right, Gamow's 1928 quantum tunnelling through the Coulomb barrier, with no fitted physics: `
    + `${ee.nuclides} even–even emitters spanning ${ee.decades} decades of half-life fall on one line of slope ${ee.slope} (orange; the bare WKB exponent predicts 1) with only ${ee.residual_sd_dex} dex of scatter. `
    + "A few MeV less energy means an exponentially thicker barrier: that is why half-lives span from femtoseconds to far beyond the age of the Universe. Odd nuclei sit above the line (hindered: the unpaired nucleon must rearrange). Click for the IAEA record.",
});