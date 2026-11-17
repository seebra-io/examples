// Who built what: every organization a source names, against the rover's
// systems. A mark is one part it designed, built or led; its shape is the kind
// of organization. Hover for the part and its role; click for the source.
// data: builders joined with parts {org, country, kind, part, system, role, source}
const rows = Array.isArray(data) ? data : [];
const orgs = d3.groups(rows, d => d.org).sort((a, b) => b[1].length - a[1].length || d3.ascending(a[0], b[0])).map(d => d[0]);
const systems = ["Whole rover", "Science instruments", "Cameras", "Sampling", "Arm", "Power", "Communications", "Computing", "Mobility", "Helicopter", "Landing"];
const colors = ["#e7e5e4", "#a3e635", "#38bdf8", "#f87171", "#fb923c", "#fbbf24", "#c084fc", "#f472b6", "#d4d4d8", "#2dd4bf", "#94a3b8"];
const shape = { agency: "diamond", lab: "square", university: "triangle", company: "circle", "research institute": "star" };
const country = Object.fromEntries(rows.map(d => [d.org, d.country]));
const el = plot({
  marginLeft: 260,
  marginBottom: 60,
  height: Math.max(300, 19 * orgs.length + 90),
  x: { domain: systems.filter(s => rows.some(d => d.system === s)), label: null, tickRotate: -25 },
  y: { domain: orgs, label: null, tickFormat: o => `${o} · ${country[o] ?? ""}` },
  color: { domain: systems, range: colors },
  symbol: { domain: Object.keys(shape), range: Object.values(shape), legend: true },
  marks: [
    Plot.dot(rows, Plot.dodgeX("middle", { x: "system", y: "org", fill: "system", symbol: "kind", r: 6, padding: 1, tip: true,
      title: d => `${d.org} (${d.country}, ${d.kind})\n${d.part}: ${d.role}\nclick: source`, href: "source", target: "_blank" })),
  ],
  caption: "One mark per part an organization designed, built or led, by the rover's system. Rows: most parts first. Only claims a fetched source states; the table lists them all with their sources.",
});
return el;