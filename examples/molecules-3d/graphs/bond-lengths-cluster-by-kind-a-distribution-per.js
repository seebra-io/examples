// Each bond's length (Å) in PubChem's computed conformer, one row per kind
// (C–N single, C=O double, …). Notice: lengths fall in bands by kind, and a
// double bond is shorter than a single one between the same atoms. C–H is
// tight; C–N "single" spreads from about 1.37 to 1.46 Å because the ring's
// conjugated bonds sit between single and double (the order is Kekulé
// bookkeeping). Caveat: a computed conformer (force field), not a
// measurement, and only a few bonds per kind (n on the right).
const [bonds, stats] = [data[0] || [], data[1] || []];
const order = stats.map(d => d.kind);
return plot({
  marginLeft: 56,
  height: Math.max(220, (fit?.height ?? 320)),
  x: {label: "Bond length (Å)", grid: true},
  y: {label: null, domain: order},
  color: {type: "ordinal", domain: [1, 2], range: ["#a1a1aa", "#f59e0b"], tickFormat: d => d === 2 ? "double" : "single", label: "Bond order"},
  marks: [
    // the range per kind (min to max), with its mean as a tick
    Plot.ruleY(stats, {y: "kind", x1: "min_A", x2: "max_A", stroke: "currentColor", strokeOpacity: 0.3, strokeWidth: 6}),
    Plot.tickX(stats, {y: "kind", x: "mean_A", stroke: "currentColor", strokeWidth: 2}),
    // the bonds themselves; hover for the two atoms and the length
    Plot.dot(bonds, {y: "kind", x: "length", fill: "order", r: 4, fillOpacity: 0.85,
      title: d => `${d.kind} bond, atoms ${d.a}–${d.b}\n${d.length} Å · order ${d.order}`, tip: true}),
    Plot.text(stats, {y: "kind", x: "max_A", text: d => `n=${d.n}`, dx: 14, textAnchor: "start", fill: "currentColor", fillOpacity: 0.6}),
  ],
});