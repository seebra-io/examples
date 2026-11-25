// The deployment's rollouts from its ReplicaSets (one per pod template;
// annotation deployment.kubernetes.io/revision, and revision-history when a
// rollback made an old one current again) and the deployment controller's
// ScalingReplicaSet events. A ReplicaSet's first revision happened when it
// was made; a later one (a rollback reuses the old ReplicaSet) when it was
// scaled up again, which only the events say: they expire (an hour by
// default), so an old rollback's time can be unknown.
// Inputs: 0 the ReplicaSetList, 1 the EventList (namespace {{namespace}}).
(() => {
  const [rsl = {}, evl = {}] = Array.isArray(data) ? data : [data];
  const DEP = "{{deployment}}", NS = "{{namespace}}";
  const sample = !!(rsl && rsl.seebra_sample);
  const mine = (rsl.items || []).filter((r) => ((r.metadata || {}).ownerReferences || []).some((o) => o.kind === "Deployment" && o.name === DEP));
  const ups = new Map();
  for (const e of (evl && evl.items) || []) {
    if (e.reason !== "ScalingReplicaSet" || (e.involvedObject || {}).name !== DEP) continue;
    const m = /^Scaled up replica set (\S+) to (\d+)/.exec(e.message || "");
    if (!m) continue;
    const t = Date.parse(e.eventTime || e.firstTimestamp || (e.metadata || {}).creationTimestamp);
    if (!isFinite(t)) continue;
    if (!ups.has(m[1])) ups.set(m[1], []);
    ups.get(m[1]).push(t);
  }
  const entries = [];
  for (const r of mine) {
    const md = r.metadata || {}, a = md.annotations || {};
    const cur = Number(a["deployment.kubernetes.io/revision"]);
    const hist = String(a["deployment.kubernetes.io/revision-history"] || "").split(",").map(Number).filter((x) => x > 0);
    const revs = [...new Set([...hist, cur].filter((x) => x > 0))].sort((x, y) => x - y);
    const images = (((r.spec || {}).template || {}).spec || {}).containers || [];
    revs.forEach((rev, i) => entries.push({
      rev, rs: md.name, hash: (md.labels || {})["pod-template-hash"] || "", created: Date.parse(md.creationTimestamp),
      ups: (ups.get(md.name) || []).slice().sort((x, y) => x - y), first: i === 0,
      images: images.map((c) => c.image), replicas: (r.status || {}).replicas || 0, current: rev === cur,
    }));
  }
  entries.sort((a, b) => a.rev - b.rev);
  let prevAt = -Infinity;
  for (const e of entries) {
    if (e.first) { e.at = e.created; e.time_from = "ReplicaSet created"; }
    else {
      const t = e.ups.find((x) => x > prevAt + 1000);
      e.at = t == null ? null : t;
      e.time_from = t == null ? "unknown: a rollback, and its scale-up event has expired" : "scale-up event (a rollback)";
    }
    if (e.at != null) prevAt = e.at;
  }
  const tagOf = (img) => (img ? String(img).replace(/^.*\//, "").replace(/@sha256:.*/, "@digest") : "?");
  const ver = (img) => { const t = tagOf(img); return t.includes(":") ? t.slice(t.indexOf(":") + 1) : t; };
  const newest = entries.length ? entries[entries.length - 1].rev : null;
  return entries.map((e, i) => {
    const prev = entries[i - 1];
    const from = prev ? prev.images[0] : null, to = e.images[0];
    const change = `${tagOf(from)} → ${prev && tagOf(from).split(":")[0] === tagOf(to).split(":")[0] ? ver(to) : tagOf(to)}`;
    return {
      rollout: e.rev,
      label: `Rollout ${e.rev} (${e.first ? "" : "rollback: "}${prev ? change : tagOf(to)})`,
      at: e.at == null ? null : new Date(e.at).toISOString(),
      at_ms: e.at,
      time_from: e.time_from,
      from_image: from || "",
      to_image: to || "",
      images: e.images.join(", "),
      replicaset: e.rs,
      pod_template_hash: e.hash,
      rollback: !e.first,
      running_now: e.current && e.replicas > 0,
      newest: e.rev === newest,
      namespace: NS,
      deployment: DEP,
      sample,
    };
  });
})()