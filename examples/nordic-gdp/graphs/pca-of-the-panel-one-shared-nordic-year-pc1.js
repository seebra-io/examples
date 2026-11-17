// PCA of the panel: rows are years, columns the five countries' log growth.
// data[0]: each year's pc1, pc2; data[1]: the share of variance per component.
const [scores, variance] = data;
const share = c => { const v = (variance || []).find(r => r.component === c); return v ? Math.round(100 * v.share) + "%" : "?"; };
const rows = (scores || []).filter(d => d.pc1 != null);
const countries = ["Denmark", "Finland", "Iceland", "Norway", "Sweden"];
return plot({
  height: (fit?.height ?? 400) - 36,
  color: false,
  x: {label: "year", tickFormat: "d"},
  y: {label: `PC1 score (standard units; ${share("pc1")} of the variance)`, grid: true},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(rows, {x: "year", y: "pc1", fill: d => d.pc1 >= 0 ? "#38bdf8" : "#f472b6",
      tip: true, title: d => `${d.year}: PC1 ${d.pc1.toFixed(2)}, PC2 ${d.pc2.toFixed(2)}\n` +
        countries.map(c => `${c} ${(100 * d[c]).toFixed(1)}%`).join(" · ") + " (log growth)"}),
  ],
  caption: `One shared Nordic year: PC1 moves all five together (${share("pc1")} of the variance), PC2 is mostly Iceland (${share("pc2")}). Caveat: current US$, so PC1 carries the dollar's swings, not only real growth; ${rows.length} years is a short panel.`,
});