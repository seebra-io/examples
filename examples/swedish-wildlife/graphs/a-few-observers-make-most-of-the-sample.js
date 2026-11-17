// Sightings per observer in this sample of recent photographed records.
// Notice: a handful of people make most of them, so the class mix above says
// as much about what they photograph as about what lives in Sweden.
// Caveat: one page of the newest records (48), not a survey.
const total = d3.sum(data, d => d.sightings);
return plot({
  marginLeft: 120,
  height: Math.max(200, fit?.height ?? 300),
  x: {label: "Sightings in this sample (records)", grid: true},
  y: {label: null},
  marks: [
    Plot.barX(data, {y: "observer", x: "sightings", sort: {y: "-x"}, fill: "steelblue",
      title: d => `${d.observer}\n${d.sightings} sightings (${Math.round(100 * d.sightings / total)}% of ${total})\n${d.species} species · ${d.classes} classes`, tip: true}),
    Plot.ruleX([0]),
  ],
});