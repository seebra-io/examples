// Each node's requested share of its allocatable CPU and memory (a Cleveland dot plot).
// The grey line between a node's two dots is its imbalance: the resource on the left is stranded.
const nodes = Array.isArray(data) ? data : [];
const f = d3.format(".2~f"), pct = d3.format(".0%");
const rows = nodes.flatMap(d => [
  {node: d.node, resource: "CPU", share: d.cpu_share, used: d.cpu_req, alloc: d.cpu_alloc, unit: "cores", d},
  {node: d.node, resource: "memory", share: d.mem_share, used: d.mem_req_gib, alloc: d.mem_alloc_gib, unit: "GiB", d},
]);
const max = Math.max(1.05, d3.max(rows, r => r.share) ?? 1);
return plot({
  height: Math.max(160, nodes.length * 28 + 70),
  marginLeft: 150,
  x: {label: "requested share of allocatable →", tickFormat: "%", domain: [0, max], grid: true},
  y: {label: null, domain: nodes.map(d => d.node)},
  color: {domain: ["CPU", "memory"], range: ["#f97316", "#38bdf8"], legend: true},
  marks: [
    Plot.ruleY(nodes, {y: "node", x1: "cpu_share", x2: "mem_share", stroke: "currentColor", strokeOpacity: 0.3, strokeWidth: 3}),
    Plot.ruleX([1], {stroke: "#ef4444", strokeDasharray: "4 3"}),
    Plot.dot(rows, {y: "node", x: "share", fill: "resource", r: 6, tip: true,
      title: r => `${r.node}: ${r.resource} ${f(r.used)} of ${f(r.alloc)} ${r.unit} requested (${pct(r.share)})\n` +
        `pods ${r.d.pods_used} of ${r.d.pods} · Ready ${r.d.ready ?? "?"} · kubelet ${r.d.kubelet}\n` +
        `room for ${r.d.fit} more typical pods (${f(r.d.typical_cpu)} cores, ${f(r.d.typical_mem_gib)} GiB), limited by ${r.d.limited_by}\n` +
        `next: kubectl describe node ${r.node}  (Allocated resources)`}),
  ],
  caption: "Requests, not usage: the scheduler places a pod on a node only if the node's free (allocatable minus requested) CPU and memory both cover the pod's requests. Allocatable is capacity minus what the system reserves. A NotReady node still shows its pods here.",
});