// Where the energy comes from: share of hours against share of energy per wind bin.
const bins = Array.isArray(data) ? data : [];
const long = bins.flatMap(b => [{v_bin: b.v_bin, what: "share of hours", pct: b.hours_share_pct, hours: b.hours, energy: b.energy_mwh},
                                {v_bin: b.v_bin, what: "share of energy", pct: b.energy_share_pct, hours: b.hours, energy: b.energy_mwh}]);
return plot({
  height: fit?.height ?? 300,
  x: {label: "wind speed bin (m/s) →", grid: true},
  y: {label: "↑ % of the two months", grid: true},
  color: {legend: true, domain: ["share of hours", "share of energy"], range: ["#a1a1aa", "#dc2626"]},
  marks: [
    Plot.rectY(long, {x1: d => d.v_bin - 0.25, x2: d => d.v_bin + 0.25, y: "pct", fill: "what", fillOpacity: 0.6, mixBlendMode: "multiply"}),
    Plot.tip(long, Plot.pointerX({x: "v_bin", y: "pct", fill: "what", channels: {"bin (m/s)": "v_bin", what: "what", "%": "pct", hours: "hours", "energy (MWh)": "energy"}})),
    Plot.ruleY([0]),
  ],
  caption: "Because power goes with the cube of the wind speed, the windy hours count far more than the calm ones: the energy (red) sits well to the right of the hours (grey). A site's mean wind speed alone says little; the mean of v³ is what pays.",
});