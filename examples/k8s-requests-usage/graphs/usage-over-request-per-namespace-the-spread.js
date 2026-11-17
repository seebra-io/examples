// The distribution of usage / request per namespace, on a log scale (1 = uses exactly its request).
// Box: the middle half; line: the median; dots: every container. The diamond is the pooled ratio.
const rows = (Array.isArray(data?.[0]) ? data[0] : []).filter(d => d.ratio > 0);
const all = Array.isArray(data?.[1]) ? data[1] : [];
const ns = Array.isArray(data?.[2]) ? data[2] : [];
const order = d3.groupSort(rows, v => -d3.sum(v, d => d.requested - d.used), d => d.namespace);
const pct = d3.format(".0%");
const noCpu = all.filter(d => d.cpu_req == null).length, noMem = all.filter(d => d.mem_req_mib == null).length;
return plot({
  height: Math.max(220, order.length * 2 * 26 + 90),
  marginLeft: 120,
  x: {type: "log", label: "usage / request (log) →", grid: true, tickFormat: "~%"},
  y: {label: null, domain: order},
  fy: {label: null},
  marks: [
    Plot.ruleX([1], {stroke: "#ef4444", strokeDasharray: "4 3"}),
    Plot.ruleX([0.25], {stroke: "currentColor", strokeOpacity: 0.3, strokeDasharray: "2 3"}),
    Plot.boxX(rows, {x: "ratio", y: "namespace", fy: "resource", fill: "#38bdf8", fillOpacity: 0.25, stroke: "currentColor", r: 0}),
    Plot.dot(rows, {x: "ratio", y: "namespace", fy: "resource", r: 2.5, fill: "#f97316", fillOpacity: 0.7, tip: true,
      title: d => `${d.namespace}/${d.pod} · ${d.container}\n${d.resource}: uses ${pct(d.ratio)} of its request (${d3.format(".3~s")(d.used)} of ${d3.format(".3~s")(d.requested)})`}),
    Plot.dot(ns, {x: "pooled", y: "namespace", fy: "resource", symbol: "diamond", r: 6, stroke: "currentColor", fill: "none", tip: true,
      title: d => `${d.namespace}, ${d.resource}: ${d.containers} containers\npooled: all usage / all requests = ${pct(d.pooled)}\n` +
        `median ${pct(d.median)} · middle 80% ${pct(d.p10)}–${pct(d.p90)}\nidle requests: ${d3.format(".3~s")(d.idle)}`}),
  ],
  caption: `Namespaces by idle requests (requested minus used), most first. Left of the dotted line a container asks for 4× what it uses; right of the red one it uses more than it asked for. ` +
    `Not in the ratio: ${noCpu} containers without a CPU request and ${noMem} without a memory request (BestEffort for that resource: the scheduler doesn't reserve anything for them).`,
});