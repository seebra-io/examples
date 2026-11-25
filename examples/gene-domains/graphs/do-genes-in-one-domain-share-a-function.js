// Do genes that share a domain share a function? The observed mean purity
// (the share of a domain's annotated genes in its most common system) against
// 1,000 shuffles of the systems: anywhere on the chromosome (grey), and only
// among genes within the same 5 Mb (blue), which keeps tandem gene families
// together. Observed above both: domains hold more of one function than the
// neighbourhood alone explains.
const c = data || {};
const nulls = [
  ...(c.null_anywhere || []).map((v) => ({v, test: "shuffled anywhere"})),
  ...(c.null_nearby || []).map((v) => ({v, test: `shuffled within ${c.shuffled_nearby?.window_mb ?? 5} Mb`})),
];
const fmt = (x) => (x == null ? "?" : x.toFixed(2));
const p = (x) => (x == null ? "?" : x <= 0.001 ? "< 0.001" : x.toFixed(3));
return plot({
  height: Math.min(fit?.height ?? 360, 380),
  x: {label: "mean purity of a domain (share of its genes in its top system)"},
  y: {label: "shuffles", grid: true},
  color: {domain: ["shuffled anywhere", `shuffled within ${c.shuffled_nearby?.window_mb ?? 5} Mb`], range: ["#71717a", "#3b82f6"], legend: true},
  marks: [
    Plot.rectY(nulls, Plot.binX({y: "count"}, {x: "v", fill: "test", mixBlendMode: "screen", fillOpacity: 0.8, thresholds: 60,
      tip: true})),
    Plot.ruleX([c.observed], {stroke: "#fbbf24", strokeWidth: 2}),
    Plot.text([c.observed], {x: (d) => d, frameAnchor: "top", dy: 6, dx: -6, textAnchor: "end", fill: "#fbbf24",
      text: () => `observed ${fmt(c.observed)}\n${c.domains_tested} domains, ${c.genes_tested} genes\np ${p(c.shuffled_anywhere?.p)} anywhere, ${p(c.shuffled_nearby?.p)} nearby`}),
    Plot.ruleY([0]),
  ],
});