// The namespace's objects from the Kubernetes API as rows of three kinds:
// - rollout: each Deployment's revisions from its ReplicaSets (annotation
//   deployment.kubernetes.io/revision; a rollback reuses an old ReplicaSet,
//   timed by the deployment controller's ScalingReplicaSet event, as in the
//   "Did the deploy do it?" board): the deploy markers on the charts;
// - pod: where it runs, its phase, readiness, restarts and why it last
//   stopped (OOMKilled), its requests and limits; the workload it belongs to
//   (its ReplicaSet's Deployment, its StatefulSet, DaemonSet or Job);
// - event: what the cluster said about them (newest first; events expire,
//   an hour by default).
// Inputs: 0 the PodList, 1 the EventList, 2 the ReplicaSetList (namespace
// {{namespace}}). The sample's times are put onto the clock as the metrics'.
(() => {
  const [pl = {}, evl = {}, rsl = {}] = Array.isArray(data) ? data.map((x) => x || {}) : [data || {}];
  const now = Date.now();
  const sample = !!(pl.seebra_sample || evl.seebra_sample || rsl.seebra_sample);
  const clock = pl.seebra_sample_clock || evl.seebra_sample_clock || rsl.seebra_sample_clock;
  // the sample's timestamps onto the clock: whole periods on, the newest now
  const ISO = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z$/;
  const retime = (o) => {
    if (!clock) return o;
    const P = clock.period_s * 1000, base = Math.floor(now / P) * P - Date.parse(clock.start);
    const walk = (x) => {
      if (Array.isArray(x)) return x.map(walk);
      if (x && typeof x === "object") { const y = {}; for (const k in x) y[k] = walk(x[k]); return y; }
      if (typeof x === "string" && ISO.test(x)) { let t = Date.parse(x) + base; if (t > now) t -= P; return new Date(t).toISOString(); }
      return x;
    };
    return walk(o);
  };
  const pods = (retime(pl).items) || [], evs = (retime(evl).items) || [], rss = (retime(rsl).items) || [];
  const ms = (s) => { const t = Date.parse(s); return isFinite(t) ? t : null; };
  const rsOwner = new Map();
  for (const r of rss) {
    const o = ((r.metadata || {}).ownerReferences || []).find((x) => x.kind === "Deployment");
    if (o) rsOwner.set(r.metadata.name, o.name);
  }
  const workloadOf = (p) => {
    const md = p.metadata || {};
    const o = (md.ownerReferences || []).find((x) => x.controller) || (md.ownerReferences || [])[0];
    if (!o) return md.name;
    if (o.kind === "ReplicaSet") return rsOwner.get(o.name) || o.name.replace(/-[a-z0-9]{6,10}$/, "");
    if (o.kind === "Job") return o.name.replace(/-\d{6,}$/, "");
    return o.name;
  };
  const out = [];
  const row = (o) => out.push({ kind: "", workload: "", name: "", t_ms: null, node: "", phase: "", ready: null, restarts: null, reason: "", message: "",
    type: "", object_kind: "", count: null, image: "", rollout: null, from_image: "", to_image: "", rollback: null, label: "",
    created_ms: null, last_stop_ms: null, cpu_request: "", memory_limit: "", sample, ...o });
  const podWorkload = new Map();
  for (const p of pods) {
    const md = p.metadata || {}, st = p.status || {}, cs = (st.containerStatuses || [])[0] || {}, c = ((p.spec || {}).containers || [])[0] || {};
    const w = workloadOf(p);
    podWorkload.set(md.name, w);
    const term = (cs.lastState || {}).terminated;
    const waiting = (cs.state || {}).waiting;
    row({ kind: "pod", workload: w, name: md.name, t_ms: ms(md.creationTimestamp), created_ms: ms(md.creationTimestamp), node: (p.spec || {}).nodeName || "",
          phase: st.phase || "", ready: (st.conditions || []).some((x) => x.type === "Ready" && x.status === "True"),
          restarts: (st.containerStatuses || []).reduce((s, x) => s + (x.restartCount || 0), 0),
          reason: waiting ? waiting.reason || "" : term ? `last stopped: ${term.reason || "?"}${term.exitCode != null ? ` (exit ${term.exitCode})` : ""}` : "",
          last_stop_ms: term ? ms(term.finishedAt) : null, image: c.image || cs.image || "",
          cpu_request: ((c.resources || {}).requests || {}).cpu || "", memory_limit: ((c.resources || {}).limits || {}).memory || "" });
  }
  const objWorkload = (kind, name) => kind === "Pod" ? podWorkload.get(name) || name.replace(/-[a-z0-9]{6,10}-[a-z0-9]{5}$/, "").replace(/-\d+$/, "")
    : kind === "ReplicaSet" ? rsOwner.get(name) || name.replace(/-[a-z0-9]{6,10}$/, "") : name;
  for (const e of evs) {
    const io = e.involvedObject || {};
    const t = ms(e.lastTimestamp) ?? ms(e.eventTime) ?? ms(e.firstTimestamp) ?? ms((e.metadata || {}).creationTimestamp);
    row({ kind: "event", workload: objWorkload(io.kind, io.name || ""), name: io.name || "", object_kind: io.kind || "", t_ms: t, type: e.type || "",
          reason: e.reason || "", message: String(e.message || "").slice(0, 300), count: e.count || 1 });
  }
  // rollouts per Deployment, as deploy-did-it finds them
  const ups = new Map();
  for (const e of evs) {
    if (e.reason !== "ScalingReplicaSet") continue;
    const m = /^Scaled up replica set (\S+) to (\d+)/.exec(e.message || "");
    if (!m) continue;
    const t = ms(e.eventTime || e.firstTimestamp || (e.metadata || {}).creationTimestamp);
    if (t == null) continue;
    if (!ups.has(m[1])) ups.set(m[1], []);
    ups.get(m[1]).push(t);
  }
  const byDep = new Map();
  for (const r of rss) {
    const dep = rsOwner.get((r.metadata || {}).name);
    if (!dep) continue;
    const md = r.metadata, a = md.annotations || {};
    const cur = Number(a["deployment.kubernetes.io/revision"]);
    const hist = String(a["deployment.kubernetes.io/revision-history"] || "").split(",").map(Number).filter((x) => x > 0);
    const revs = [...new Set([...hist, cur].filter((x) => x > 0))].sort((x, y) => x - y);
    const images = ((((r.spec || {}).template || {}).spec || {}).containers || []).map((c) => c.image);
    if (!byDep.has(dep)) byDep.set(dep, []);
    revs.forEach((rev, i) => byDep.get(dep).push({ rev, rs: md.name, created: ms(md.creationTimestamp), ups: (ups.get(md.name) || []).slice().sort((x, y) => x - y), first: i === 0, images }));
  }
  const tagOf = (img) => (img ? String(img).replace(/^.*\//, "").replace(/@sha256:.*/, "@digest") : "?");
  for (const [dep, entries] of byDep) {
    entries.sort((a, b) => a.rev - b.rev);
    let prevAt = -Infinity;
    for (const e of entries) {
      if (e.first) e.at = e.created;
      else { const t = e.ups.find((x) => x > prevAt + 1000); e.at = t == null ? null : t; }
      if (e.at != null) prevAt = e.at;
    }
    entries.forEach((e, i) => {
      const prev = entries[i - 1];
      const from = prev ? prev.images[0] : "", to = e.images[0] || "";
      row({ kind: "rollout", workload: dep, name: e.rs, rollout: e.rev, t_ms: e.at, from_image: from || "", to_image: to, rollback: !e.first,
            label: `${dep} rollout ${e.rev}${e.first ? "" : " (rollback)"}: ${prev ? `${tagOf(from)} → ${tagOf(to).split(":").pop()}` : tagOf(to)}` });
    });
  }
  return out.sort((a, b) => (b.t_ms ?? 0) - (a.t_ms ?? 0));
})()