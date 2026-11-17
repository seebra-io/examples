// Pods per namespace, stacked by phase (the pods of the API's first page, limit=500)
const rows = Array.isArray(data) ? data : [];
const phases = ["Running", "Pending", "Succeeded", "Failed", "Unknown"];
const total = d3.rollup(rows, v => d3.sum(v, d => d.pods), d => d.namespace);
const order = [...total.keys()].sort((a, b) => total.get(b) - total.get(a));
const meaning = {Running: "bound to a node, at least one container running (not necessarily ready)",
  Pending: "accepted, but not all containers are running: being scheduled, pulling images or creating",
  Succeeded: "all containers exited 0 and won't restart (a finished Job)",
  Failed: "all containers ended, at least one in failure; it stays until deleted",
  Unknown: "the node can't be reached"};
return plot({
  height: Math.max(160, order.length * 24 + 70),
  marginLeft: 140,
  x: {label: "pods →", grid: true, tickFormat: "d"},
  y: {label: null, domain: order},
  color: {domain: phases, range: ["#22c55e", "#eab308", "#94a3b8", "#ef4444", "#a855f7"], legend: true},
  marks: [
    Plot.barX(rows, {y: "namespace", x: "pods", fill: "phase", order: phases, tip: true,
      title: d => `${d.namespace}: ${d.pods} of ${total.get(d.namespace)} pods ${d.phase} (${d3.format(".0%")(d.pods / total.get(d.namespace))})\n` +
        `${d.phase}: ${meaning[d.phase] ?? ""}\nnext: kubectl get pods -n ${d.namespace} --field-selector status.phase=${d.phase}`,
      href: () => "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase", target: "_blank"}),
    Plot.ruleX([0]),
  ],
  caption: "Running is not ready: a Running pod can have containers waiting in CrashLoopBackOff (see the waiting containers). Failed pods stay until someone deletes them (the Kubernetes operations example evicts them). The API answers up to limit=500 pods; for a bigger cluster read one namespace (path /api/v1/namespaces/<ns>/pods) or raise the limit.",
});