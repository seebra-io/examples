// Our radius (from parallax, brightness and temperature through Stefan–Boltzmann) against Gaia's GSP-Phot radius (fitted to the BP/RP spectrum).
// data[0]: stars {radius_sb, radius_gspphot, stage, star, link}; data[1]: checks {radius_vs_gspphot_median_dex, radius_vs_gspphot_sd_dex, radius_slope, within_10pct}
const [rows, [c]] = data;
return plot({
  height: Math.max(380, (fit?.height ?? 440) - 40),
  x: {type: "log", label: "Gaia GSP-Phot radius (R☉, log scale) →", grid: true},
  y: {type: "log", label: "↑ Stefan–Boltzmann radius √L·(5772/T)² (R☉, log scale)", grid: true},
  color: {domain: ["main sequence", "subgiant", "giant", "no FLAME stage"], range: ["#38bdf8", "#a3e635", "#f97316", "#a1a1aa"], legend: true},
  marks: [
    Plot.line([{x: 0.1, y: 0.1}, {x: 100, y: 100}], {x: "x", y: "y", stroke: "currentColor", strokeDasharray: "4,3", strokeOpacity: 0.6}),
    Plot.dot(rows, {x: "radius_gspphot", y: "radius_sb", fill: "stage", r: 2, fillOpacity: 0.7, href: "link", target: "_blank", tip: true,
      channels: {star: "star", "T (K)": "teff", "L/L☉": "lum"}}),
    Plot.text([`slope ${c.radius_slope} · median offset ${c.radius_vs_gspphot_median_dex} dex · scatter ${c.radius_vs_gspphot_sd_dex} dex · ${(100 * c.within_10pct).toFixed(0)}% within 10%`],
      {frameAnchor: "top-left", dx: 6, dy: 6, fill: "currentColor"}),
  ],
  caption: "A radius you never measured directly: the stars' sizes from light, distance and temperature land on Gaia's own spectral fit (dashed: equal). "
    + "The two are not fully independent (both use the parallax and Teff), but GSP-Phot fits the whole spectrum without a bolometric correction. Off-line stars are worth a click: binaries, or a wrong temperature.",
});