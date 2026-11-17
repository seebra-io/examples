// The folding rule: true frequency against the frequency a sampler sees.
const [fold, cons] = data;
const rows = fold || [];
const pts = (cons || []).filter(d => d.step_h > 1);
return plot({
  height: fit?.height ?? 380,
  x: {label: "true frequency (cycles per day) →", domain: [0, 2.2]},
  y: {label: "↑ apparent frequency (cpd)"},
  color: {legend: true, label: "sampled", domain: ["every 6 h", "every 11 h", "every 24 h", "every 25 h"], range: ["#16a34a", "#2563eb", "#ea580c", "#9333ea"]},
  marks: [
    Plot.line([[0, 0], [2.2, 2.2]], {stroke: "#d4d4d8", strokeDasharray: "3,3"}),
    Plot.lineY(rows, {x: "f_cpd", y: "apparent_cpd", stroke: "scheme", strokeWidth: 1.2}),
    Plot.dot(pts, {x: "f_cpd", y: "alias_cpd", fill: "scheme", r: 4, stroke: "white", tip: true,
      channels: {constituent: "constituent", "what": "what", "true period (h)": "true_period_hours", "apparent period (days)": "apparent_period_days", "sampling rate (per day)": d => d.fs_cpd.toFixed(3)}}),
    Plot.text(pts.filter(d => d.scheme === "every 24 h"), {x: "f_cpd", y: "alias_cpd", text: "constituent", dy: -9, fontSize: 10}),
  ],
  caption: "Sampling folds the frequency axis like a paper strip: up to fs/2 (Nyquist) frequencies are seen as they are, above it they come back down, zig-zag. "
    + "Dots: the tidal constituents. M2 (12.42 h) and N2 sit near 2 cpd, almost exactly twice the daily rate, so read once a day they fold to almost zero: a slow, fake wave. "
    + "Hover a dot for its apparent period. Engineers put an analogue low-pass filter before every ADC for this reason.",
});