// The most restarted containers, coloured by why they last stopped.
const top = (Array.isArray(data?.[0]) ? data[0] : []);
const last = new Map((Array.isArray(data?.[1]) ? data[1] : []).map(d => [`${d.namespace}/${d.pod}/${d.container}`, d]));
const code = {0: "exited normally", 1: "application error", 137: "SIGKILL: out of memory or killed", 139: "segmentation fault", 143: "SIGTERM: asked to stop"};
const docs = {
  OOMKilled: "https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/#exceed-a-container-s-memory-limit",
  Error: "https://kubernetes.io/docs/tasks/debug/debug-application/determine-reason-pod-failure/",
  Completed: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy",
};
const rows = top.map(d => {
  const l = last.get(`${d.namespace}/${d.pod}/${d.container}`) ?? {};
  return {...d, label: `${d.namespace}/${d.pod} · ${d.container}`, reason: l.last_reason ?? "unknown", exit_code: l.exit_code, finished: l.finished};
});
const short = s => s.length > 48 ? s.slice(0, 47) + "…" : s;
return plot({
  height: Math.max(180, rows.length * 22 + 70),
  marginLeft: 300,
  x: {label: "restarts →", grid: true, tickFormat: "d"},
  y: {label: null, domain: rows.map(d => d.label), tickFormat: short},
  color: {domain: ["Error", "OOMKilled", "Completed", "unknown"], range: ["#ef4444", "#a855f7", "#94a3b8", "#64748b"], legend: true},
  marks: [
    Plot.barX(rows, {y: "label", x: "restarts", fill: "reason", tip: true,
      title: d => `${d.namespace}/${d.pod}, container ${d.container}\n${d.restarts} restarts · ${d.owner_kind ?? "no owner"} ${d.owner ?? ""} · node ${d.node ?? "?"}\n` +
        `last stop: ${d.reason}${d.exit_code != null ? ` (exit ${d.exit_code}: ${code[d.exit_code] ?? "see the app's docs"})` : ""}${d.finished ? ` at ${d.finished}` : ""}\n` +
        `next: kubectl -n ${d.namespace} logs ${d.pod} -c ${d.container} --previous`,
      href: d => docs[d.reason] ?? docs.Error, target: "_blank"}),
    Plot.ruleX([0]),
  ],
  caption: "Click a bar for Kubernetes' page on that exit reason. Exit 137 with OOMKilled means the container went over its memory limit: compare its usage with its request in the requests-vs-usage example. Restart counts reset when a pod is recreated, so a rolled-out deployment looks healthier than it was.",
});