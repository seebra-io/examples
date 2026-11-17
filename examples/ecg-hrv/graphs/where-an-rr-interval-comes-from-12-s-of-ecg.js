// 12 seconds of record 119: the ECG voltage, the beats the cardiologists labelled, and the RR interval between each pair.
// data[0]: trace {t_s, mv}; data[1]: trace_beats {t_s, a, kind, mv, rhythm}; data[2]: trace_rr {t_prev, t_s, mid_s, rr_ms, pair}
const [samples, beats, rrs] = data;
const marks = (beats || []).filter(d => d.mv != null);
const top = d3.max(samples, d => d.mv) ?? 2;
const color = {domain: ["normal (N)", "ventricular premature (V)", "other beat", "rhythm/noise mark"], range: ["#2563eb", "#dc2626", "#a855f7", "#71717a"]};
return plot({
  height: Math.max(320, (fit?.height ?? 360) - 40),
  x: {label: "time in record 119 (s) →", grid: true},
  y: {label: "↑ lead MLII (mV)", grid: true, domain: [d3.min(samples, d => d.mv) - 0.2, top + 0.9]},
  color: {...color, legend: true, label: "annotation"},
  marks: [
    Plot.line(samples, {x: "t_s", y: "mv", stroke: "currentColor", strokeWidth: 1, tip: {format: {x: ".3f"}},
      channels: {"sample": "sample", "ADC units": "adu"}}),
    Plot.dot(marks, {x: "t_s", y: "mv", fill: "kind", r: 4, tip: true, href: d => "https://physionet.org/files/mitdb/1.0.0/mitdbdir/records.htm#119", target: "_blank",
      channels: {label: "a", "sample": "sample", "rhythm label": "rhythm"}}),
    Plot.text(marks, {x: "t_s", y: "mv", text: "a", dy: -10, fill: "kind", fontWeight: "bold"}),
    // each RR interval as a bracket above the trace, labelled in ms
    Plot.ruleY(rrs, {x1: "t_prev", x2: "t_s", y: top + 0.35, stroke: d => d.pair.includes("V") ? "#dc2626" : "#2563eb", strokeWidth: 2, tip: true,
      channels: {"RR (ms)": "rr_ms", "pair": "pair"}}),
    Plot.text(rrs, {x: "mid_s", y: top + 0.6, text: d => `${d.rr_ms}`, fontSize: 10, fill: d => d.pair.includes("V") ? "#dc2626" : "#2563eb"}),
  ],
  caption: "An RR interval is the time from one R peak (the tall spike of ventricular depolarisation) to the next; heart-rate variability is built only from these intervals. "
    + "Here record 119 slips from normal rhythm into ventricular bigeminy: every second beat is a premature ventricular contraction (red V, wide and inverted), "
    + "so the intervals alternate short (N→V, the coupling interval) and long (V→N, the compensatory pause). Hover the trace for exact samples (360 Hz, 200 ADC units per mV); click a beat for the record's clinical notes.",
});