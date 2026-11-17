// Premature ventricular beats: the interval before (coupling) against the interval after (pause).
// data[0]: pauses {record, coupling_ms, pause_ms, sum_ms, nn_median, compensation, t_s, link}; data[1]: hrv
const [rows] = data;
const recs = [...new Set(rows.map(d => d.record))];
const med = Object.fromEntries(rows.map(d => [d.record, d.nn_median]));
// coupling + pause = 2 × NN: the full compensatory pause line for each record
const lines = recs.map(r => ({record: r, x1: 0.3 * med[r], y1: 1.7 * med[r], x2: 1.0 * med[r], y2: 1.0 * med[r]}));
return plot({
  height: Math.max(340, (fit?.height ?? 380) - 40),
  x: {label: "coupling interval N→V (ms) →", grid: true},
  y: {label: "↑ pause V→N (ms)", grid: true},
  color: {legend: true, label: "record"},
  marks: [
    Plot.link(lines, {x1: "x1", y1: "y1", x2: "x2", y2: "y2", stroke: "record", strokeDasharray: "5,3", strokeWidth: 1.5}),
    Plot.dot(rows, {x: "coupling_ms", y: "pause_ms", fill: "record", r: 2.5, fillOpacity: 0.7, href: "link", target: "_blank", tip: true,
      channels: {"t (s)": "t_s", "coupling + pause (ms)": "sum_ms", "median NN (ms)": "nn_median", "(coupling + pause) / 2NN": "compensation"}}),
  ],
  caption: "Each dot is a premature ventricular beat between two normal beats. Dashed: coupling + pause = 2 × the record's median NN interval, the full compensatory pause: "
    + "the early ventricular beat doesn't reach the sinus node, so the next sinus beat comes on its own schedule. Dots on the line are why one PVC adds two wild RR intervals but no net time: "
    + "the sinus rhythm underneath keeps ticking. Hover for each beat's timing; click for the record's notes.",
});