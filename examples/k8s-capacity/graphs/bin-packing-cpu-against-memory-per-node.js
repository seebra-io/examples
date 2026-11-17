// Bin-packing: each node's requested CPU share against its memory share.
// On the diagonal both fill together; far from it one resource runs out first and strands the other.
const nodes = Array.isArray(data?.[0]) ? data[0] : [];
const pods = Array.isArray(data?.[1]) ? data[1] : [];
const f = d3.format(".2~f"), pct = d3.format(".0%");
const pending = pods.filter(p => p.node === "(not scheduled)").sort((a, b) => b.cpu_req - a.cpu_req);
const freeCpu = d3.sum(nodes, d => Math.max(0, d.cpu_free)), maxCpu = d3.max(nodes, d => d.cpu_free) ?? 0;
const freeMem = d3.sum(nodes, d => Math.max(0, d.mem_free_gib)), maxMem = d3.max(nodes, d => d.mem_free_gib) ?? 0;
const big = pending[0];
return plot({
  aspectRatio: 1,
  x: {label: "CPU requested →", tickFormat: "%", domain: [0, 1.05], grid: true},
  y: {label: "↑ memory requested", tickFormat: "%", domain: [0, 1.05], grid: true},
  r: {range: [4, 14]},
  color: {domain: ["Ready", "not Ready"], range: ["#22c55e", "#ef4444"], legend: true},
  marks: [
    Plot.line([[0, 0], [1, 1]], {stroke: "currentColor", strokeOpacity: 0.35, strokeDasharray: "4 3"}),
    Plot.rect([{}], {x1: 1, x2: 1.05, y1: 0, y2: 1.05, fill: "#ef4444", fillOpacity: 0.08}),
    Plot.rect([{}], {x1: 0, x2: 1.05, y1: 1, y2: 1.05, fill: "#ef4444", fillOpacity: 0.08}),
    Plot.dot(nodes, {x: "cpu_share", y: "mem_share", r: "cpu_alloc", fill: d => d.ready === "True" ? "Ready" : "not Ready", fillOpacity: 0.8, tip: true,
      title: d => `${d.node} (${d.ready === "True" ? "Ready" : "not Ready"})\nCPU ${f(d.cpu_req)} / ${f(d.cpu_alloc)} cores (${pct(d.cpu_share)}), free ${f(d.cpu_free)}\n` +
        `memory ${f(d.mem_req_gib)} / ${f(d.mem_alloc_gib)} GiB (${pct(d.mem_share)}), free ${f(d.mem_free_gib)}\n` +
        (Math.abs(d.cpu_share - d.mem_share) > 0.25 ? `${d.cpu_share > d.mem_share ? "memory" : "CPU"} is stranded here: the other resource runs out first` : "balanced")}),
    Plot.text(nodes, {x: "cpu_share", y: "mem_share", text: "node", dy: -12, fontSize: 10, fill: "currentColor", fillOpacity: 0.7}),
  ],
  caption: `Free in all: ${f(freeCpu)} cores and ${f(freeMem)} GiB, but at most ${f(maxCpu)} cores and ${f(maxMem)} GiB on any one node: a pod asking for more stays Pending. ` +
    (big ? `${pending.length} pod${pending.length > 1 ? "s are" : " is"} not scheduled; the largest, ${big.namespace}/${big.pod}, asks for ${f(big.cpu_req)} cores and ${f(big.mem_req_gib)} GiB (its FailedScheduling events say why: Kubernetes warning events example). ` : "Every pod is scheduled. ") +
    "Dot size: the node's allocatable CPU. Taints, affinity and GPUs also decide where a pod may go, and aren't drawn.",
});