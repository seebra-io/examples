// Observations per consensus name, coloured by the community's mean confidence (-3..3).
// Many names for what a European would call one chanterelle: the genus was split by DNA.
// data: mo_names {name, observations, mean_confidence, lowest, unsure, proposed_names}
const rows = Array.isArray(data) ? data : [];
return plot({
  marginLeft: 200,
  height: Math.max(260, 22 * rows.length + 60),
  x: {label: "observations with photos, 2025 →", grid: true},
  y: {label: null, domain: rows.map(d => d.name)},
  color: {type: "linear", domain: [0, 3], scheme: "YlGn", legend: true, label: "mean confidence"},
  marks: [
    Plot.barX(rows, {y: "name", x: "observations", fill: "mean_confidence", tip: true,
      title: d => `${d.name}: ${d.observations} observations\nmean confidence ${d.mean_confidence} (lowest ${d.lowest}); ${d.unsure} below 1\n${d.proposed_names} names proposed in all`}),
    Plot.ruleX([0]),
  ],
  caption: "Mushroom Observer is mostly North American. Confidence is the vote on the consensus name; a low score marks an identification still in question.",
});