// Loki's answer to logql (Parameters) over the last {{window}}: streams of
// [nanosecond timestamp, line], as one row per line with its pod, level and
// a template (numbers, ids and hex replaced) so the same message counts as
// one. Newest first, at most 5000 lines (Loki's limit): on a noisy service
// the oldest rollouts' windows may have no lines left.
(() => {
  const a = data || {};
  const sample = !!a.seebra_sample;
  const out = [];
  for (const s of ((a.data || {}).result) || []) {
    const st = s.stream || {};
    for (const [ns, line] of s.values || []) {
      const t = Math.floor(Number(String(ns).slice(0, -6)));
      const text = String(line).replace(/^\d{4}-\d\d-\d\dT[\d:.]+Z\s+/, "");
      const level = st.level || st.detected_level || (/^(ERROR|WARN|INFO|DEBUG)\b/.exec(text) || [])[1]?.toLowerCase() || "";
      const msg = text.replace(/^(ERROR|WARN|INFO|DEBUG)\s+/, "");
      const template = msg.replace(/\b[0-9a-f]{8}-[0-9a-f-]{27}\b/g, "<id>").replace(/\b\d+(\.\d+)*/g, "N").replace(/(SKU-)N/g, "$1N").slice(0, 160);
      out.push({ t: new Date(t).toISOString(), t_ms: t, pod: st.pod || st.pod_name || "", level, line: msg.slice(0, 400), template,
                 pod_template_hash: (/-([a-z0-9]{6,10})-[a-z0-9]{5}$/.exec(st.pod || "") || [])[1] || "", sample });
    }
  }
  return out.sort((x, y) => y.t_ms - x.t_ms);
})()