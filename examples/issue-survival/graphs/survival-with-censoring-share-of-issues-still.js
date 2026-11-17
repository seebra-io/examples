// Kaplan–Meier: the share of issues still open t days after they were opened, with a 95% band (Greenwood).
// Crosses on the curves are censored issues: still open when the data was read, so we only know they lasted at least that long.
// data[0]: km {grp, days, at_risk, closed, censored, survival, lo, hi}; data[1]: medians per group
const [rows, med] = data;
const groups = med.map(d => d.grp);
// each curve starts at 100% open at day 0
const steps = groups.flatMap(g => [{grp: g, days: 0, survival: 1, lo: 1, hi: 1}, ...rows.filter(d => d.grp === g)]);
const m = new Map(med.map(d => [d.grp, d]));
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 40),
  x: {type: "symlog", constant: 7, label: "days since the issue was opened (symlog scale) →", grid: true, ticks: [0, 1, 7, 30, 90, 180, 365, 600]},
  y: {label: "↑ still open (Kaplan–Meier)", tickFormat: "%", domain: [0, 1], grid: true},
  color: {domain: groups, range: ["currentColor", "#ef4444", "#38bdf8", "#a1a1aa"], legend: true,
          tickFormat: g => `${g} (${m.get(g)?.issues}, ${m.get(g)?.still_open} open)`},
  marks: [
    Plot.areaY(steps, {x: "days", y1: "lo", y2: "hi", fill: "grp", fillOpacity: 0.08, curve: "step-after"}),
    Plot.line(steps, {x: "days", y: "survival", stroke: "grp", strokeWidth: 2, curve: "step-after"}),
    Plot.dot(rows.filter(d => d.censored > 0), {x: "days", y: "survival", stroke: "grp", symbol: "plus", r: 4}),
    Plot.ruleY([0.5], {stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "4,3"}),
    Plot.dot(rows, Plot.pointer({x: "days", y: "survival", fill: "grp", r: 4, tip: true,
      title: d => `${d.grp}, day ${d.days}: ${(100 * d.survival).toFixed(0)}% still open (95%: ${(100 * d.lo).toFixed(0)}–${(100 * d.hi).toFixed(0)}%)\n${d.at_risk} at risk, ${d.closed} closed here, ${d.censored} censored here`})),
  ],
  caption: "Notice: a third of these issues are still open, so averaging only the closed ones makes issues look faster than they are (the table compares the medians). "
    + "Kaplan–Meier counts an open issue as 'at least this long' and drops it from the risk set at its last look. "
    + "Caveats: 100 issues from two weeks of one repository; 'closed' includes 'not planned' and duplicates (competing reasons); censoring is assumed unrelated to how long an issue would stay open.",
});