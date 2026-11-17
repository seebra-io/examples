// One dot per file, by collection, on a log scale of its size. Size is what a
// viewer waits for: under ~3 MB loads in a second or two, Seebra reads files up
// to 25 MB (the dashed rule), and the largest are scans of whole surfaces.
// data: models {title, family, collection, format, mb, added, url}
const rows = (Array.isArray(data) ? data : []).filter(d => d.mb > 0);
const order = d3.groups(rows, d => d.collection).sort((a, b) => b[1].length - a[1].length).map(d => d[0]);
return plot({
  marginLeft: 150,
  x: {type: "log", label: "File size (MB, log scale)", grid: true},
  y: {axis: null},
  color: {domain: ["glb", "stl"], range: ["#38bdf8", "#f59e0b"], legend: true},
  marks: [
    Plot.ruleX([25], {stroke: "#f87171", strokeDasharray: "4,3"}),
    Plot.dot(rows, Plot.dodgeY({x: "mb", fy: "collection", stroke: "format", r: 3,
      title: d => `${d.title}\n${d.collection} · .${d.format} · ${d.mb} MB · added ${d.added}\nclick: the file`, href: "url", target: "_blank", tip: true})),
  ],
  fy: {domain: order, label: null},
  height: 70 * order.length + 60,
});