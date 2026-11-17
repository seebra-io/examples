// Accuracy of a single Δχ threshold, for every threshold.
// data[0]: stump {t, n, correct, accuracy, best}; data[1]: accuracy
const [rows, acc] = [data[0] || [], data[1] || []];
const base = acc.find(d => String(d.rule).startsWith("always")) || {};
return plot({
  height: Math.max(280, (fit?.height ?? 340) - 20),
  x: {label: "threshold on Δχ (tetrahedral if below) →", grid: true},
  y: {label: "↑ share classified right", tickFormat: "%", domain: [0.3, 1], grid: true},
  marks: [
    base.accuracy != null ? Plot.ruleY([base.accuracy], {strokeDasharray: "3 3", strokeOpacity: 0.6}) : null,
    base.accuracy != null ? Plot.text([base.accuracy], {y: d => d, frameAnchor: "right", dy: -6, text: () => "always guess the larger class", fill: "currentColor", fillOpacity: 0.6}) : null,
    Plot.line(rows, {x: "t", y: "accuracy", stroke: "#0ea5e9"}),
    Plot.dot(rows, {x: "t", y: "accuracy", fill: d => d.best ? "#ef4444" : "#0ea5e9", r: d => d.best ? 5 : 2.5, tip: true, channels: {threshold: "t", correct: "correct", compounds: "n"}}),
  ],
  caption: "One number, the electronegativity difference, already sorts most octet compounds into four- or six-fold coordination; the peak is the best threshold. The table compares it with the two-variable line.",
});