// Recalls per 1,000 listed products, per route, with a 95% Poisson interval.
// A count needs an exposure: the raw count (hover) mostly says how many products there are.
const rows = data.filter(d => d.rate != null);
const countRank = new Map([...rows].sort((a, b) => b.recalls - a.recalls).map((d, i) => [d.route, i + 1]));
return plot({
  height: (fit?.height ?? 400) - 40,
  marginLeft: 170,
  color: false,
  x: {type: "log", label: "recalls per 1,000 listed products (log scale)", grid: true},
  y: {label: null, domain: rows.map(d => d.route)},
  marks: [
    Plot.ruleY(rows, {y: "route", x1: "lo", x2: "hi", stroke: "currentColor", strokeOpacity: 0.5, strokeWidth: 2}),
    Plot.dot(rows, {y: "route", x: "rate", r: d => Math.sqrt(d.recalls) / 4 + 2, fill: "#f97316",
      tip: true, title: d => `${d.route}: ${d.rate.toFixed(1)} recalls per 1,000 products (95%: ${d.lo.toFixed(1)}–${d.hi.toFixed(1)})\n` +
        `${d3.format(",")(d.recalls)} recalls since 2004 · ${d3.format(",")(d.products)} products listed today\nrank ${countRank.get(d.route)} of ${rows.length} by count, ${rows.indexOf(d) + 1} by rate`}),
  ],
  caption: "Oral drugs lead the raw count but not the rate. Caveats: recalls are counted since 2004 and only those openFDA matched to a product (many compounded ones aren't); products are today's NDC listings, not units sold or patients exposed.",
});