// Median response spectrum shape per distance bin: SA(T)/PGA against the oscillator's period T.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: fit?.height ?? 400,
  x: {label: "oscillator (building) natural period T (s) →", ticks: [0, 0.3, 1, 3]},
  y: {label: "↑ SA(T) / PGA (median; 1 = moves like the ground)", grid: true},
  color: {legend: true, scheme: "viridis", label: "distance from the rupture"},
  marks: [
    Plot.ruleY([1], {stroke: "#a1a1aa", strokeDasharray: "3,3"}),
    Plot.lineY(rows, {x: "period_s", y: "median_amp", stroke: "dist_bin", strokeWidth: 2, curve: "monotone-x"}),
    Plot.dot(rows, {x: "period_s", y: "median_amp", fill: "dist_bin", r: 4, tip: true,
      channels: {distance: "dist_bin", "period (s)": "period_s", stations: "stations", "median SA/PGA": "median_amp", "25–75%": d => `${d.q25} – ${d.q75}`,
        "median SA (%g)": "median_sa_g", "≈ storeys (T ≈ N/10)": d => d.period_s ? Math.round(d.period_s * 10) : "rigid"}}),
    Plot.text([[0.3, 0], [1, 0], [3, 0]].map(([t]) => ({t, label: `≈ ${Math.round(t * 10)} storeys`})), {x: "t", y: () => 0.15, text: "label", fontSize: 9, fill: "#71717a"}),
  ],
  caption: "Near the fault (dark) a stiff 3-storey building (T ≈ 0.3 s) feels about twice the ground's acceleration and a 30-storey tower (3 s) only a quarter of it. Hundreds of kilometres away the curve has turned round: the short-period shaking has been absorbed on the way, the long periods have not, and tall buildings now feel the most relative to the ground. "
    + "This is why the 1985 Michoacán quake destroyed 10–20 storey buildings in Mexico City, 350 km away. Hover for the numbers.",
});