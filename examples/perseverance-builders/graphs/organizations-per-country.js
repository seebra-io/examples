// Where Perseverance was made: the organizations in each country, by kind.
// NASA's JPL designed and built most of the rover; partners abroad led
// instruments (France's SuperCam mast unit, Spain's MEDA, Norway's RIMFAX).
// data: builders {org, country, kind, part}
const rows = Array.isArray(data) ? data : [];
const orgs = d3.groups(rows, d => d.org).map(([org, v]) => ({ org, country: v[0].country, kind: v[0].kind, parts: v.length, list: [...new Set(v.map(d => d.part))].join(", ") }));
const order = d3.groups(orgs, d => d.country).sort((a, b) => b[1].length - a[1].length).map(d => d[0]);
return plot({
  marginLeft: 120,
  height: Math.max(200, 30 * order.length + 70),
  x: { label: "organizations →", grid: true },
  y: { domain: order, label: null },
  color: { legend: true, domain: ["agency", "lab", "university", "company", "research institute"], range: ["#38bdf8", "#a78bfa", "#facc15", "#f97316", "#34d399"] },
  marks: [
    Plot.barX(orgs, Plot.stackX({ y: "country", x: 1, fill: "kind", stroke: "#0c0a09", tip: true,
      title: d => `${d.org} (${d.kind})\n${d.parts} part${d.parts > 1 ? "s" : ""}: ${d.list}` })),
  ],
  caption: "Each block is one organization; hover for what it worked on. Counts organizations a source names, not money or effort.",
});