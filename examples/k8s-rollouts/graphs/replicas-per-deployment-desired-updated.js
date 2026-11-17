// Each deployment's desired replicas (ring), available (dot) and updated (tick).
// Unfinished rollouts first; a gap between ring and dot is missing capacity.
const all = Array.isArray(data) ? data : [];
const rank = {"stuck (deadline exceeded)": 0, "unavailable": 1, "rolling out": 2, "waiting for the controller": 3, "old pods terminating": 4, "complete": 5};
const rows = [...all].sort((a, b) => rank[a.state] - rank[b.state] || b.missing - a.missing || a.deployment.localeCompare(b.deployment)).slice(0, 40)
  .map(d => ({...d, label: `${d.namespace}/${d.deployment}`}));
const states = Object.keys(rank);
return plot({
  height: Math.max(180, rows.length * 22 + 80),
  marginLeft: 220,
  x: {label: "replicas →", grid: true, tickFormat: "d"},
  y: {label: null, domain: rows.map(d => d.label)},
  color: {domain: states, range: ["#ef4444", "#f97316", "#eab308", "#a855f7", "#38bdf8", "#22c55e"], legend: true},
  marks: [
    Plot.ruleY(rows, {y: "label", x1: "available", x2: "desired", stroke: "currentColor", strokeOpacity: 0.3, strokeWidth: 3}),
    Plot.dot(rows, {y: "label", x: "desired", r: 6, stroke: "currentColor", strokeOpacity: 0.7}),
    Plot.tickX(rows, {y: "label", x: "updated", stroke: "#38bdf8", strokeWidth: 2}),
    Plot.dot(rows, {y: "label", x: "available", r: 4, fill: "state", tip: true,
      title: d => `${d.label}: ${d.state}\ndesired ${d.desired} · updated ${d.updated} · ready ${d.ready} · available ${d.available} · all pods ${d.current}\n` +
        `generation ${d.generation}, observed ${d.observed ?? "?"} · ${d.strategy}\n${d.progress ?? ""}${d.progress_message ? ": " + d.progress_message : ""}\n` +
        `next: kubectl -n ${d.namespace} rollout status deployment/${d.deployment}`}),
  ],
  caption: `${all.filter(d => d.state !== "complete").length} of ${all.length} deployments are not complete${all.length > 40 ? " (the first 40 are drawn)" : ""}. Ring: desired; dot: available (ready for minReadySeconds); blue tick: on the latest template. A rollout that passes progressDeadlineSeconds is marked stuck but is not rolled back: that's up to you (kubectl rollout undo).`,
});