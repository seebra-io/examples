// Count against energy: the year's quakes per magnitude bin, and the share of the year's seismic energy each bin released.
// data: fmd {m, n, energy_share}
const rows = Array.isArray(data) ? data : [];
const long = rows.flatMap(d => [{m: d.m, what: "share of the earthquakes", v: d.n / d3.sum(rows, r => r.n), n: d.n}, {m: d.m, what: "share of the energy released", v: d.energy_share, n: d.n}]);
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 40),
  marginTop: 24,
  fy: {label: null, axis: null},
  x: {label: "magnitude M →", grid: true},
  y: {label: "↑ share", tickFormat: ".0%", grid: true},
  marks: [
    // each facet's label in its top-left corner (a vertical facet axis can't sit on top)
    Plot.text([...new Set(long.map(d => d.what))], {fy: d => d, text: d => d, frameAnchor: "top-left", dx: 4, dy: 2, fontWeight: "bold", lineWidth: 90, stroke: "var(--plot-background)", strokeWidth: 3, paintOrder: "stroke"}),
    Plot.rectY(long, {fy: "what", x1: d => d.m - 0.05, x2: d => d.m + 0.05, y: "v", fill: d => d.what.includes("energy") ? "#f97316" : "#38bdf8", tip: true,
      channels: {M: "m", quakes: "n", share: d => `${(100 * d.v).toFixed(2)}%`}}),
    Plot.ruleY([0]),
  ],
  caption: "Each magnitude unit is 10 times fewer quakes but 10^1.5 ≈ 32 times more energy each, so energy grows about 3× per unit while numbers fall 10×: the rare giants dominate. "
    + "In 2025 one quake, the M 8.8 off Kamchatka on 29 July, released most of the year's energy (see the table). Caveat: E = 10^(1.5M + 4.8) J is the radiated-energy rule of thumb, best for Mw.",
});