// Every run of the day as a bar from start to last update, in arrival order; colour: workflow.
const rows = Array.isArray(data) ? data : [];
const top = d3.rollups(rows, v => d3.sum(v, d => d.duration_min), d => d.name).sort((a, b) => b[1] - a[1]).slice(0, 8).map(d => d[0]);
const wf = d => top.includes(d.name) ? d.name : "other workflows";
return plot({
  height: Math.max(420, fit?.height ?? 520),
  marginLeft: 40,
  x: {label: "time since 00:00 UTC, 10 Nov 2026 (hours) →", grid: true},
  y: {label: "↑ run, in order of arrival", axis: null},
  color: {legend: true, domain: [...top, "other workflows"], scheme: "tableau10", label: "workflow"},
  marks: [
    Plot.ruleX([24], {stroke: "#a1a1aa", strokeDasharray: "3,3"}),
    Plot.barX(rows, {x1: d => d.arrive_min / 60, x2: d => Math.max(d.depart_min, d.arrive_min + 0.5) / 60, y: "order", fill: wf, insetTop: 0, insetBottom: 0,
      href: "html_url", target: "_blank", tip: true,
      channels: {workflow: "name", event: "event", conclusion: "conclusion", "created (UTC)": "created_at", "last update (UTC)": "updated_at", "in the system (min)": "duration_min"}}),
  ],
  caption: "Each bar is one run, open to the next step: click it for the run on GitHub. A vertical line through the chart crosses as many bars as there are runs in flight at that moment: that count is L(t) (next chart). "
    + "Pull requests and pushes arrive in bursts of 15–20 workflows at once; the CircleCI redirector arrives most often but leaves within seconds, the wheel builders and test matrices stay 15–30 minutes. Re-runs and runs whose last update came over 6 hours after their start are left out (the clean step's suspect flag).",
});