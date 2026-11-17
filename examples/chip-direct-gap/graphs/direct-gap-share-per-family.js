// Share of direct-gap materials per family, with Wilson 95% intervals (rates).
const rows = Array.isArray(data) ? data : [];
return plot({
  height: Math.max(260, (fit?.height ?? 320) - 20),
  marginLeft: 130,
  x: {label: "share with a direct gap →", domain: [0, 1], tickFormat: "%", grid: true},
  y: {domain: rows.map(d => d.family), label: null},
  marks: [
    Plot.barX(rows, {y: "family", x: "share", fill: "#f97316", fillOpacity: 0.65, tip: true,
      channels: {materials: "n", direct: "n_direct", "95% interval": d => `${(d.lo * 100).toFixed(0)}–${(d.hi * 100).toFixed(0)}%`, "median gap (eV)": "median_gap_ev", "median direct − gap (eV)": "median_margin_ev"}}),
    Plot.ruleY(rows, {y: "family", x1: "lo", x2: "hi", stroke: "currentColor", strokeWidth: 2}),
    Plot.text(rows, {y: "family", x: "hi", text: d => `${d.n_direct} of ${d.n}`, dx: 6, textAnchor: "start", fill: "currentColor"}),
  ],
  caption: "Bars: the share of each family's stable materials with a direct gap; lines: 95% Wilson intervals (wide where a family has few members). The group IV elements are all indirect.",
});