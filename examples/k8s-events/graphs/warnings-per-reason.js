// Warning events per reason, coloured by the kind of object they are about.
const rows = (Array.isArray(data) ? data : []).slice(0, 25).map(d => ({...d, label: `${d.reason} · ${d.kind ?? "?"}`}));
const docs = {
  BackOff: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-restarts",
  Unhealthy: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/",
  FailedScheduling: "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/",
  FailedMount: "https://kubernetes.io/docs/concepts/storage/volumes/",
  FailedAttachVolume: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
  NodeNotReady: "https://kubernetes.io/docs/concepts/architecture/nodes/#condition",
  FailedCreate: "https://kubernetes.io/docs/concepts/policy/resource-quotas/",
  Evicted: "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/",
  OOMKilling: "https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/",
  ProgressDeadlineExceeded: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#failed-deployment",
  Failed: "https://kubernetes.io/docs/concepts/containers/images/#imagepullbackoff",
};
return plot({
  height: Math.max(180, rows.length * 22 + 70),
  marginLeft: 240,
  x: {label: "events →", grid: true, tickFormat: "d"},
  y: {label: null, domain: rows.map(d => d.label)},
  marks: [
    Plot.barX(rows, {y: "label", x: "events", fill: "kind", tip: true,
      title: d => `${d.reason} about ${d.objects} ${d.kind ?? "?"} object${d.objects > 1 ? "s" : ""} in ${d.namespaces} namespace${d.namespaces > 1 ? "s" : ""}\n` +
        `${d.events} events, ${d.occurrences} occurrences counting repeats · latest ${d.latest}\n` +
        `next: kubectl get events -A --field-selector reason=${d.reason}`,
      href: d => docs[d.reason] ?? `https://kubernetes.io/search/?q=${encodeURIComponent(d.reason)}`, target: "_blank"}),
    Plot.ruleX([0]),
  ],
  caption: "Click a bar for Kubernetes' docs on that reason. One root cause shows up under several reasons (a NotReady node gives NodeNotReady, then FailedScheduling and BackOff on its pods): look at the minute they started together in the timeline.",
});