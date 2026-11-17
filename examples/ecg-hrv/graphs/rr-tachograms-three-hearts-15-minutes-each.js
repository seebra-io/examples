// RR tachograms: every interval of the first 15 minutes, per record. Normal-to-normal intervals as a line, intervals touching an ectopic beat as red dots.
// data: rr {record, label, t_s, rr_ms, pair, nn, link}
const rows = Array.isArray(data) ? data : [];
const records = [...new Set(rows.map(d => d.record))];
const lab = Object.fromEntries(rows.map(d => [d.record, d.label]));
return plot({
  height: Math.max(420, (fit?.height ?? 480) - 40),
  marginTop: 24,
  fy: {label: null, domain: records, tickFormat: r => `${r}: ${lab[r]}`, axis: "top"},
  x: {label: "time from the start of the record (s) →", grid: true},
  y: {label: "↑ RR interval (ms)", grid: true},
  marks: [
    Plot.line(rows.filter(d => d.nn), {fy: "record", x: "t_s", y: "rr_ms", z: "record", stroke: "#2563eb", strokeWidth: 0.8, tip: true,
      channels: {"RR (ms)": "rr_ms", "HR (bpm)": d => (60000 / d.rr_ms).toFixed(1), pair: "pair", beat: "beat"}}),
    Plot.dot(rows.filter(d => !d.nn), {fy: "record", x: "t_s", y: "rr_ms", fill: "#dc2626", r: 1.6, tip: true, href: "link", target: "_blank",
      channels: {"RR (ms)": "rr_ms", pair: "pair", beat: "beat"}}),
  ],
  caption: "Blue: normal-to-normal (NN) intervals; red: intervals that begin or end at an ectopic beat (premature atrial A or ventricular V). "
    + "The healthy heart (top) is not a metronome: its RR wanders by tens of ms with breathing (respiratory sinus arrhythmia) and slower rhythms. "
    + "In 119 the red dots split into two bands, short couplings and long pauses: they are not variability of the sinus node but a different pacemaker firing early. Hover for the interval and pair; click a red dot for the record's notes.",
});