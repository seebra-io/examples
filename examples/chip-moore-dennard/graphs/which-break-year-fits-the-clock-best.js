// The evidence for the break: the clock data's two-line fit for every candidate break year.
// data: breaks {brk, sse, n_before, n_after, slope_before, slope_after, best}
const rows = Array.isArray(data) ? data : [];
const best = rows.find(d => d.best) || {};
return plot({
  height: Math.max(300, (fit?.height ?? 360) - 20),
  x: {label: "candidate break year →", tickFormat: "d"},
  y: {label: "↑ sum of squared residuals, log2(MHz)²", grid: true, zero: false},
  marks: [
    Plot.line(rows, {x: "brk", y: "sse", stroke: "#0ea5e9"}),
    Plot.dot(rows, {x: "brk", y: "sse", fill: d => d.best ? "#ef4444" : "#0ea5e9", r: d => d.best ? 6 : 3.5, tip: true,
      channels: {"break year": "brk", "clock doublings/yr before": "slope_before", "clock doublings/yr after": "slope_after", "processors before": "n_before", "processors after": "n_after"}}),
    Plot.text([best], {x: "brk", y: "sse", text: d => `${d.brk}: before ${d.slope_before} doublings/yr, after ${d.slope_after}`, dy: -14, fill: "currentColor"}),
  ],
  caption: "Lower is a better fit. The valley says when the clock stopped doubling: the data picks the year, not us. "
    + "Hover a dot for both slopes. Caveat: the points are not evenly spread in time, and a few late overclocked parts pull the 'after' line.",
});