// Poincaré plot: each RR interval against the next. Facets per record; NN pairs in blue, pairs touching an ectopic beat in red.
// data[0]: rr {record, rr_ms, rr_next, poincare_nn, pair}; data[1]: hrv {record, sd1, sd2, mean_rr_nn, rmssd_nn, sd1_times_sqrt2}
const [rows, stats] = data;
const pts = rows.filter(d => d.rr_next != null);
const records = [...new Set(pts.map(d => d.record))];
const st = Object.fromEntries(stats.map(s => [s.record, s]));
// SD1 runs across the identity line (beat-to-beat), SD2 along it (slow changes): draw both as axes centred on the NN mean
const axes = stats.flatMap(s => {
  const m = s.mean_rr_nn, c = Math.SQRT1_2;
  return [
    {record: s.record, axis: "SD2 (along)", x1: m - s.sd2 * c, y1: m - s.sd2 * c, x2: m + s.sd2 * c, y2: m + s.sd2 * c, ms: s.sd2},
    {record: s.record, axis: "SD1 (across)", x1: m + s.sd1 * c, y1: m - s.sd1 * c, x2: m - s.sd1 * c, y2: m + s.sd1 * c, ms: s.sd1},
  ];
});
const [lo, hi] = d3.extent(pts.flatMap(d => [d.rr_ms, d.rr_next]));
return plot({
  height: Math.max(380, (fit?.height ?? 420) - 40),
  marginTop: 24,
  fx: {label: null, domain: records, tickFormat: r => st[r] ? `${r}: SD1 ${st[r].sd1} ms, SD2 ${st[r].sd2} ms` : r},
  x: {label: "RRₙ (ms) →", grid: true, domain: [lo, hi]},
  y: {label: "↑ RRₙ₊₁ (ms)", grid: true, domain: [lo, hi]},
  color: {domain: ["NN → NN", "with an ectopic beat"], range: ["#2563eb", "#dc2626"], legend: true},
  marks: [
    Plot.line([[lo, lo], [hi, hi]], {stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "4,3"}),
    Plot.dot(pts, {fx: "record", x: "rr_ms", y: "rr_next", r: 1.4, fillOpacity: 0.6, fill: d => d.poincare_nn ? "NN → NN" : "with an ectopic beat", tip: true,
      channels: {pair: "pair", "next beat": "nxt", beat: "beat", "t (s)": "t_s"}}),
    Plot.link(axes, {fx: "record", x1: "x1", y1: "y1", x2: "x2", y2: "y2", stroke: d => d.axis.startsWith("SD1") ? "#f97316" : "#16a34a", strokeWidth: 3, tip: true,
      channels: {axis: "axis", "length (ms)": "ms"}}),
  ],
  caption: "Each dot is one interval against the next. A metronome would be a single point; the healthy heart is a comet along the dashed identity line: "
    + "short-term, beat-to-beat changes (SD1, orange, = RMSSD/√2, the vagal brake) are narrower than slow changes (SD2, green). "
    + "Ectopic beats throw dots far off the line (short-then-long, long-then-short), which is why HRV is computed from NN intervals only. SD1 and SD2 are from NN → NN pairs.",
});