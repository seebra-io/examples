// Predicted vs reported vapour pressure: from the boiling point alone (Trouton + Clausius–Clapeyron), log-log, with the factor-of-2 band.
// data[0]: compounds {p_pa, p_trouton_pa, p_fit_pa, hbond, name, ...}; data[1]: by_group {hbond, within_2x_fit}
const [rows0, groups] = data;
const rows = (rows0 || []).filter(d => d.plausible);
const classes = ["no H-bond donor", "N–H donor (amines, amides)", "O–H donor (alcohols, acids, water)"];
const [lo, hi] = d3.extent(rows.flatMap(d => [d.p_pa, d.p_fit_pa]));
const diag = k => [lo, hi].map(v => ({p: v, y: v * k}));
const share = h => { const g = (groups || []).find(g => g.hbond === h); return g ? `${Math.round(100 * g.within_2x_fit)}% within ×2` : ""; };
return plot({
  height: Math.max(420, (fit?.height ?? 500) - 40),
  x: {type: "log", label: "predicted from the boiling point (Pa, log scale) →", grid: true, tickFormat: "~s"},
  y: {type: "log", label: "↑ reported vapour pressure (Pa, log scale)", grid: true, tickFormat: "~s"},
  color: {domain: classes, range: ["#64748b", "#2563eb", "#dc2626"], legend: true, tickFormat: h => `${h}: ${share(h)}`},
  marks: [
    Plot.line(diag(1), {x: "p", y: "y", stroke: "currentColor", strokeOpacity: 0.6}),
    Plot.line(diag(2), {x: "p", y: "y", stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "4,3"}),
    Plot.line(diag(0.5), {x: "p", y: "y", stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "4,3"}),
    Plot.dot(rows, {x: "p_fit_pa", y: "p_pa", fill: "hbond", r: 3, fillOpacity: 0.8, href: "wikidata", target: "_blank", tip: true,
      channels: {substance: "name", "boiling point (°C)": "tb_c", "reading at (°C)": "t_c", "Trouton (10.5 R) prediction (Pa)": "p_trouton_pa",
        "log₁₀ reported/predicted": "log_ratio_fit"}}),
  ],
  caption: "x: P = 1 atm · exp(−(ΔS/R)(Tb/T − 1)) with one ΔS for every liquid (the median of the non-donors), so the only input is the boiling point; y: the vapour pressure Wikidata reports. Dashed: a factor of 2 either way. "
    + "Across nine orders of magnitude the boiling point alone gets most liquids within a factor of 2 (legend), which is why shortcut distillation design starts from boiling points; the O–H donors fall below the band. Hover a dot; click it for its Wikidata item and the source of each value.",
});