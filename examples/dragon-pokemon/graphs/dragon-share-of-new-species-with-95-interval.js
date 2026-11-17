// A rate needs an exposure: Dragon species as a share of all species new in that
// generation, with a 95% interval (Jeffreys, from the beta distribution) for a count this small.
// The dashed line is the share over all nine generations.
const overall = data[0]?.overall_pct;
return plot({
  color: false,
  x: {label: "generation", tickFormat: (g) => `Gen ${g}`, type: "point", inset: 20},
  y: {label: "Dragon share of new species (%)", grid: true, domain: [0, d3.max(data, (d) => d.hi_pct) * 1.1]},
  marks: [
    Plot.ruleY([overall], {stroke: "currentColor", strokeDasharray: "4,3", strokeOpacity: 0.6}),
    Plot.text([overall], {y: (d) => d, frameAnchor: "right", dy: -6, text: (d) => `all generations: ${d}%`, fill: "currentColor", fillOpacity: 0.7}),
    Plot.ruleX(data, {x: "generation", y1: "lo_pct", y2: "hi_pct", stroke: "#a78bfa", strokeWidth: 3, strokeOpacity: 0.6}),
    Plot.dot(data, {x: "generation", y: "share_pct", fill: "#6f35fc", r: 5,
      channels: {"Dragon species": "dragons", "new species": "new_species", "95% low (%)": "lo_pct", "95% high (%)": "hi_pct"}, tip: true}),
  ],
});