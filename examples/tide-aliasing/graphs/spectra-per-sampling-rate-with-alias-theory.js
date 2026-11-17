// The amplitude spectrum per sampling scheme, with where theory says each tidal constituent should land.
const [spec, cons] = data;
const order = ["every 1 h", "every 6 h", "every 11 h", "every 24 h", "every 25 h", "daily mean (filtered)"];
const rows = (spec || []).filter(d => order.includes(d.scheme));
const lines = (cons || []).filter(d => ["M2", "K1", "S2"].includes(d.constituent) && order.includes(d.scheme));
return plot({
  height: Math.max(520, fit?.height ?? 620),
  marginRight: 120,
  fy: {domain: order, label: null},
  x: {label: "apparent frequency (cycles per day) →", domain: [0, 2.2]},
  y: {label: "↑ amplitude (m)", grid: true},
  color: {legend: true, domain: ["M2", "K1", "S2"], range: ["#dc2626", "#2563eb", "#16a34a"], label: "theory: where the constituent should appear"},
  marks: [
    Plot.ruleX(lines, {fy: "scheme", x: "alias_cpd", stroke: "constituent", strokeDasharray: "4,3", strokeOpacity: 0.8}),
    Plot.lineY(rows, {fy: "scheme", x: "f_cpd", y: "amplitude_m", stroke: "currentColor", strokeWidth: 1}),
    Plot.ruleX(rows.filter(d => d.f_cpd === d3.max(rows.filter(e => e.scheme === d.scheme), e => e.f_cpd)), {fy: "scheme", x: "nyquist_cpd", stroke: "#a1a1aa"}),
    Plot.tip(rows, Plot.pointer({fy: "scheme", x: "f_cpd", y: "amplitude_m",
      channels: {"frequency (cpd)": "f_cpd", "period": d => d.f_cpd < 1 ? (1 / d.f_cpd).toFixed(2) + " days" : (24 / d.f_cpd).toFixed(2) + " h", "amplitude (m)": d => d.amplitude_m.toFixed(3), samples: "samples", "Nyquist (cpd)": "nyquist_cpd"}})),
    Plot.tip(lines, Plot.pointer({fy: "scheme", x: "alias_cpd", stroke: "constituent",
      channels: {constituent: "constituent", "true period (h)": "true_period_hours", "apparent period (days)": "apparent_period_days", "folded?": d => d.aliased ? "yes, above Nyquist" : "no"}})),
  ],
  caption: "Each panel is a Fourier transform of the same water levels, sampled differently. Read hourly, the tide's lines sit at 1.93 cpd (M2) and 1.0 cpd (K1). "
    + "Every 6 hours (Nyquist 2 cpd) they still sit there. Every 11, 24 or 25 hours they are above Nyquist (grey rule at the panel's right end) and reappear at |f − k·fs|, exactly where the dashed theory lines say: "
    + "M2 at 0.068 cpd (14.8 days) for daily readings, K1 at 0.043 cpd (23 days) for 25-hourly ones (the table lists every peak against theory). K1 and S2 almost vanish into a constant, since daily sampling sees them at nearly the same phase every time. "
    + "Daily means (bottom) remove the tide instead of folding it.",
});