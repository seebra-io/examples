// How concentrated supervision is: the share of all recorded supervisions held by the top advisors.
// data: concentration {k, n, top_share_advisors, top_share_supervisions}
const rows = Array.isArray(data) ? data : [];
const pick = p => rows.find(d => d.top_share_advisors >= p) || {};
const one = pick(0.01), ten = pick(0.1);
return plot({
  height: Math.max(360, (fit?.height ?? 420) - 40),
  x: {type: "log", label: "share of advisors, most prolific first (log scale) →", tickFormat: "%", grid: true},
  y: {label: "↑ share of all supervisions they hold", tickFormat: "%", grid: true, domain: [0, 1]},
  marks: [
    Plot.line(rows, {x: "top_share_advisors", y: "top_share_advisors", stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "3,3"}),
    Plot.line(rows, {x: "top_share_advisors", y: "top_share_supervisions", stroke: "#2563eb", strokeWidth: 2}),
    Plot.dot(rows, {x: "top_share_advisors", y: "top_share_supervisions", r: 2.5, fill: "#2563eb", href: "link", target: "_blank", tip: true,
      channels: {"advisors with k or more students": d => `k ≥ ${d.k}`, "advisors at exactly k": "n"}}),
  ],
  caption: `Read from the left: the top ${(100 * one.top_share_advisors).toFixed(1)}% of advisors (${one.k} or more students) hold ${(100 * one.top_share_supervisions).toFixed(1)}% of all recorded supervisions, the top ${(100 * ten.top_share_advisors).toFixed(0)}% hold ${(100 * ten.top_share_supervisions).toFixed(0)}%. `
    + `The dashed diagonal is equal shares. Cumulative advantage: an advisor with students attracts more (reputation, funding, a group), so supervision piles up on a few.`,
});