// The chart of nuclides: every known ground state by neutron and proton number, coloured by how it decays.
// data: nuclides {z, n, n0, n1, z0, z1, nuclide, mode, half_life, unit_hl, log_t, link}
const rows = Array.isArray(data) ? data : [];
const modes = ["stable", "β−", "β+ / EC", "α", "fission", "p emission", "n emission", "other"];
return plot({
  height: Math.max(420, (fit?.height ?? 500) - 40),
  x: {label: "neutrons N →", grid: true},
  y: {label: "↑ protons Z", grid: true},
  color: {domain: modes, range: ["#18181b", "#38bdf8", "#f472b6", "#facc15", "#a3e635", "#f97316", "#a78bfa", "#a1a1aa"], legend: true},
  marks: [
    Plot.rect(rows, {x1: "n0", x2: "n1", y1: "z0", y2: "z1", fill: "mode", href: "link", target: "_blank", tip: true,
      channels: {nuclide: "nuclide", Z: "z", N: "n", "half-life": d => d.half_life === "STABLE" ? "stable" : `${d.half_life ?? "?"} ${d.unit_hl ?? ""}`, "log₁₀ t½ (s)": "log_t"}}),
    Plot.line([[0, 0], [130, 130]], {stroke: "currentColor", strokeDasharray: "3,3", strokeOpacity: 0.5}),
  ],
  caption: "The black valley of stability bends below N = Z (dashed) as nuclei grow: protons repel, so heavy nuclei need extra neutrons. "
    + "Too many neutrons: β− (blue); too few: β+ or capture (pink). Past lead (Z = 82) the yellow α emitters take over: shedding a helium nucleus releases energy, and how fast depends on tunnelling (next chart). Hover a cell; click for its IAEA data.",
});