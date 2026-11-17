// Pods that failed, are pending, unreachable, restarting or not ready, by restarts.
// Hover for the parameters an eviction needs; the colour says what an eviction would do.
const pods = Array.isArray(data?.[0]) ? data[0] : [];
const pdbs = Array.isArray(data?.[1]) ? data[1] : [];
const blocked = new Set(pdbs.filter(p => p.allowed === 0).map(p => p.namespace));
const effect = d => d.phase === "Failed" || d.phase === "Succeeded" ? "deleted (terminal pod, no budget check)"
  : !d.recreated ? "gone for good (no owner)"
  : blocked.has(d.namespace) ? "may be refused (a budget here allows 0)"
  : "recreated by its owner";
const rows = pods.slice(0, 40).map(d => ({...d, label: `${d.namespace}/${d.pod}`, effect: effect(d), x: Math.max(d.restarts, 0.5)}));
return plot({
  height: Math.max(180, rows.length * 22 + 80),
  marginLeft: 280,
  x: {type: "log", label: "restarts (log; 0 drawn at ½) →", grid: true},
  y: {label: null, domain: rows.map(d => d.label)},
  color: {domain: ["recreated by its owner", "deleted (terminal pod, no budget check)", "may be refused (a budget here allows 0)", "gone for good (no owner)"],
          range: ["#22c55e", "#94a3b8", "#eab308", "#ef4444"], legend: true},
  symbol: {domain: ["failed", "pending", "node unreachable", "restarting", "not ready"], legend: false},
  marks: [
    Plot.ruleY(rows, {y: "label", x1: 0.5, x2: "x", stroke: "currentColor", strokeOpacity: 0.2}),
    Plot.dot(rows, {y: "label", x: "x", fill: "effect", symbol: "why", r: 5, tip: true,
      title: d => `${d.label}: ${d.why} (${d.phase}), ${d.restarts} restarts, ${d.not_ready} of ${d.containers} containers not ready\n` +
        `owner: ${d.owner_kind ? d.owner_kind + " " + d.owner : "none"} · node ${d.node ?? "(not scheduled)"}\n` +
        `an eviction: ${d.effect}\nparameters: ${d.parameters}\nfirst: kubectl -n ${d.namespace} describe pod ${d.pod}`}),
  ],
  caption: "Evicting fixes what a fresh pod fixes (a wedged process, a bad node); it doesn't fix a crash loop in the code or a missing image: read the pod's events first. Pending pods are usually waiting for room (see the capacity example), not for an eviction.",
});