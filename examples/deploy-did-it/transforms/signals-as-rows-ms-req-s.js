// Prometheus' answer to the board's one subquery ((... or ...)[{{window}}:{{step}}]:
// a matrix, a series per signal) as rows: one per signal, service and time.
// p99 comes in seconds (histogram_quantile over a _seconds histogram) and is
// shown in ms; the error ratio is shown in %; traffic is requests/s;
// restarts are container restarts per step. NaN (no requests in a step) and
// steps with no sample (a scrape gap) are left out: the coverage counts them.
(() => {
  const a = data || {};
  const sample = !!a.seebra_sample;
  const result = ((a.data || {}).result) || [];
  const scale = { p99: 1000, neighbour_p99: 1000, error_ratio: 100, traffic: 1, restarts: 1 };
  const unit = { p99: "ms", neighbour_p99: "ms", error_ratio: "%", traffic: "req/s", restarts: "restarts/step" };
  const out = [];
  for (const s of result) {
    const m = s.metric || {};
    const signal = m.signal || "unlabelled";
    const service = signal === "neighbour_p99" ? (m.service || m.job || m.app || "?") : "{{deployment}}";
    for (const [ts, v] of s.values || (s.value ? [s.value] : [])) {
      const x = Number(v);
      if (!isFinite(x)) continue;
      const t = Math.round(Number(ts) * 1000);
      out.push({ signal, service, t: new Date(t).toISOString(), t_ms: t, value: x * (scale[signal] || 1), unit: unit[signal] || "", sample });
    }
  }
  return out;
})()