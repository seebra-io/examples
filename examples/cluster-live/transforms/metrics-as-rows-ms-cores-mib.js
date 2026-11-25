// Prometheus' answers to the board's five queries (services, the same
// services yesterday, workloads and pod phases, nodes, volumes), as rows:
// one per series and time. Each query is a subquery over the last {{window}}
// at {{step}} (the volumes over {{volume_window}} at {{volume_step}}), its
// series labelled `signal` by label_replace. A series that comes twice is
// kept once (a sample answers every query with all of them).
// Units: latency in ms (histogram_quantile over a _seconds histogram),
// errors in % of requests, CPU in cores, memory in MiB (nodes in GiB),
// volumes in GiB, traffic in requests/s; restarts_total is the counter.
// "Yesterday" comes from a subquery with offset 1d, whose times are
// yesterday's: they are moved on a day, to compare with now.
// The sample (seebra_sample_clock): one period of a model, put onto the
// clock by whole periods, so its newest point is now and every refresh
// brings a new one.
(() => {
  const ins = (Array.isArray(data) ? data : [data]).filter((a) => a && typeof a === "object");
  const now = Date.now();
  const dur = (s) => { const m = /^(\d+(?:\.\d+)?)(ms|s|m|h|d|w)$/.exec(String(s).trim()); return m ? Number(m[1]) * { ms: 1, s: 1e3, m: 6e4, h: 36e5, d: 864e5, w: 6048e5 }[m[2]] : NaN; };
  const W = dur("{{window}}") || 3600e3, WV = dur("{{volume_window}}") || 6 * 3600e3;
  const groupOf = (s) => /_yesterday$/.test(s) ? "yesterday" : /^(rate|error_ratio|p50|p99)$/.test(s) ? "services"
    : /^node_/.test(s) ? "nodes" : /^pvc_/.test(s) ? "volumes" : s === "pods" ? "phases" : "workloads";
  const MiB = 1 / 1048576, GiB = 1 / 1073741824;
  const scale = { p50: 1000, p99: 1000, p99_yesterday: 1000, error_ratio: 100, memory: MiB, memory_requests: MiB, memory_limits: MiB,
                  pod_memory: MiB, pod_memory_limits: MiB, node_memory: GiB, node_memory_allocatable: GiB, pvc_used: GiB, pvc_capacity: GiB };
  const unit = (s) => /^(p50|p99)/.test(s) ? "ms" : s === "error_ratio" ? "%" : /^rate/.test(s) ? "req/s" : /cpu/.test(s) ? "cores"
    : /^node_memory/.test(s) || /^pvc_/.test(s) ? "GiB" : /memory/.test(s) ? "MiB" : s === "pods" ? "pods" : s === "restarts_total" ? "restarts" : "";
  const r5 = (x) => Number(x.toPrecision(5));
  const seen = new Set();
  const out = [];
  for (const a of ins) {
    const clock = a.seebra_sample_clock;
    const sample = !!a.seebra_sample;
    for (const s of ((a.data || {}).result) || []) {
      const m = s.metric || {};
      const key = JSON.stringify(Object.keys(m).sort().map((k) => [k, m[k]]));
      if (seen.has(key)) continue;
      seen.add(key);
      const signal = m.signal || "unlabelled";
      const group = groupOf(signal);
      let pts = (s.values || (s.value ? [s.value] : [])).map(([ts, v]) => [Math.round(Number(ts) * 1000), Number(v)]).filter(([, v]) => isFinite(v));
      if (clock && pts.length > 1) {
        const step = pts[1][0] - pts[0][0], P = step * pts.length, base = Math.floor(now / P) * P - Date.parse(clock.start);
        const w = group === "volumes" ? WV : W;
        pts = pts.map(([t, v]) => [t + base > now ? t + base - P : t + base, v]).filter(([t]) => t > now - w).sort((p, q) => p[0] - q[0]);
      } else if (group === "yesterday" && pts.length && pts[pts.length - 1][0] < now - 12 * 3600e3) {
        pts = pts.map(([t, v]) => [t + 86400e3, v]);
      }
      const entity = m.service || m.workload || m.node || m.persistentvolumeclaim || m.phase || m.job || "?";
      for (const [t, v] of pts)
        out.push({ group, signal, entity, pod: m.pod || "", t_ms: t, value: r5(v * (scale[signal] || 1)), unit: unit(signal), sample });
    }
  }
  return out;
})()