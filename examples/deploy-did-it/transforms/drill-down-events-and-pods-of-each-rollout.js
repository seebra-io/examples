// Drill down into a rollout's objects: the Kubernetes events in its
// windows that concern the deployment, its ReplicaSets or their pods
// (warnings first), and the pods of each revision that still run. Events
// expire (an hour by default; --event-ttl), so an old rollout may have none
// left; the pods of a replaced revision are gone, its logs (Loki) are not.
// Inputs: 0 the EventList, 1 the PodList, 2 the verdicts.
(() => {
  const [evl = {}, pl = {}, vs = []] = Array.isArray(data) ? data : [data];
  const DEP = "{{deployment}}";
  const sample = !!(evl.seebra_sample || pl.seebra_sample);
  const hashes = new Set(vs.map((v) => v.pod_template_hash).filter(Boolean));
  const ours = (name) => name === DEP || [...hashes].some((h) => name === `${DEP}-${h}` || name.startsWith(`${DEP}-${h}-`));
  const evs = ((evl && evl.items) || []).filter((e) => ours((e.involvedObject || {}).name || "")).map((e) => {
    const t = Date.parse(e.lastTimestamp || e.eventTime || e.firstTimestamp || (e.metadata || {}).creationTimestamp);
    return { t, kind: (e.involvedObject || {}).kind, object: (e.involvedObject || {}).name, type: e.type, reason: e.reason, message: e.message, count: e.count || 1 };
  });
  const out = [];
  for (const v of vs) {
    if (v.before_from_ms == null) continue;
    const from = v.before_from_ms, to = v.after_to_ms + 30 * 60e3;
    const mine = evs.filter((e) => e.t > from && e.t <= to)
      .sort((a, b) => (a.type === "Warning" ? 0 : 1) - (b.type === "Warning" ? 0 : 1) || a.t - b.t);
    for (const e of mine.slice(0, 40))
      out.push({ rollout: v.rollout, label: v.label, what: "event", t: new Date(e.t).toISOString(), minutes: Math.round((e.t - v.at_ms) / 60e3),
                 object: `${e.kind}/${e.object}`, type: e.type, reason: e.reason, message: e.message, count: e.count, sample });
    if (!mine.length)
      out.push({ rollout: v.rollout, label: v.label, what: "note", t: v.at, minutes: 0, object: "", type: "", reason: "no events",
                 message: "No events left for this window: they expire (an hour by default). Its logs and metrics are still there.", count: 0, sample });
    for (const p of (pl.items || [])) {
      const md = p.metadata || {};
      if ((md.labels || {})["pod-template-hash"] !== v.pod_template_hash) continue;
      const cs = ((p.status || {}).containerStatuses || [])[0] || {};
      const st = Object.keys(cs.state || {})[0] || "";
      out.push({ rollout: v.rollout, label: v.label, what: "pod", t: md.creationTimestamp, minutes: Math.round((Date.parse(md.creationTimestamp) - v.at_ms) / 60e3),
                 object: `Pod/${md.name}`, type: (p.status || {}).phase || "", reason: st + (cs.lastState && cs.lastState.terminated ? ` (last: ${cs.lastState.terminated.reason})` : ""),
                 message: `${cs.restartCount || 0} restarts, on ${(p.spec || {}).nodeName || "?"}`, count: cs.restartCount || 0, sample });
    }
  }
  return out;
})()