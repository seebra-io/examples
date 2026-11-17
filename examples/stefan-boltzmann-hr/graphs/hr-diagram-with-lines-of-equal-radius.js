// The Hertzsprung–Russell diagram with Stefan–Boltzmann's lines of equal radius: L/L☉ = (R/R☉)² (T/5772 K)⁴.
// data[0]: stars {teff, lum, radius_sb, stage, star, dist_pc, link}; data[1]: stages {stage, stars, median_radius}
const [rows, stages] = data;
const radii = [0.1, 0.3, 1, 3, 10, 30, 100];
const ts = d3.range(3300, 8001, 100);
const iso = radii.flatMap(R => ts.map(T => ({R, T, L: R * R * Math.pow(T / 5772, 4)})));
const labels = radii.map(R => ({R, T: 3300, L: R * R * Math.pow(3300 / 5772, 4), text: `${R} R☉`}));
const order = ["main sequence", "subgiant", "giant", "no FLAME stage"];
return plot({
  height: Math.max(460, (fit?.height ?? 540) - 40),
  x: {type: "log", reverse: true, label: "← effective temperature (K, log scale; hot on the left)", domain: [8100, 3200], ticks: [3500, 4000, 5000, 6000, 7000, 8000], tickFormat: "d", grid: true},
  y: {type: "log", label: "↑ luminosity L/L☉ (log scale)", domain: [0.003, 30000], grid: true},
  color: {domain: order, range: ["#38bdf8", "#a3e635", "#f97316", "#a1a1aa"], legend: true},
  marks: [
    Plot.line(iso.filter(d => d.L > 0.003 && d.L < 30000), {x: "T", y: "L", z: "R", stroke: "currentColor", strokeOpacity: 0.35, strokeDasharray: "3,3"}),
    Plot.text(labels.filter(d => d.L > 0.003 && d.L < 30000), {x: "T", y: "L", text: "text", dx: 4, textAnchor: "start", fill: "currentColor", fillOpacity: 0.6}),
    Plot.dot(rows, {x: "teff", y: "lum", fill: "stage", r: 2, fillOpacity: 0.7, href: "link", target: "_blank", tip: true,
      channels: {star: "star", "T (K)": "teff", "L/L☉": "lum", "R/R☉ (Stefan–Boltzmann)": "radius_sb", "R/R☉ (Gaia GSP-Phot)": "radius_gspphot", "M/M☉ (FLAME)": "mass_flame", "distance (pc)": "dist_pc", stage: "stage"}}),
    Plot.dot([{teff: 5772, lum: 1}], {x: "teff", y: "lum", r: 5, stroke: "#facc15", strokeWidth: 2, tip: true, title: () => "the Sun: 5772 K, 1 L☉, 1 R☉"}),
  ],
  caption: "Each dot a star from a random Gaia DR3 sample with parallaxes better than 5%. Luminosity is computed from brightness and distance (inverse-square law) with a bolometric correction; "
    + "the dashed lines are Stefan–Boltzmann's law at fixed radius. Read across at 4,800 K: main-sequence dwarfs near 0.3 L☉ and giants near 35 L☉ have the same surface temperature, "
    + "so the giant's extra light is all area: ten times the radius. The yellow ring is the Sun. Click a star for SIMBAD. Caveat: a bright, nearby-weighted sample (giants are over-represented: they are seen farther).",
});