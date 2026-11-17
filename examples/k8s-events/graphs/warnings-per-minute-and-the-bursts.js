// Warning events per minute. If they came at random (a Poisson process at the window's mean rate),
// a minute above the dashed line would happen by chance in fewer than 5% of windows this long.
const mins = Array.isArray(data?.[0]) ? data[0] : [];
const evs = Array.isArray(data?.[1]) ? data[1] : [];
const t = m => new Date(m * 60000);
const rate = mins[0]?.rate ?? 0, span = mins[0]?.span ?? 1, total = mins[0]?.total ?? 0, disp = mins[0]?.dispersion ?? NaN;
// the smallest k with P(X >= k) <= 0.05 / span for X ~ Poisson(rate)
let k = 0, cdf = 0, pk = Math.exp(-rate);
while (1 - cdf > 0.05 / span && k < 1000) { cdf += pk; k++; pk *= rate / k; }
const top = d3.rollup(evs, v => d3.rollups(v, a => a.length, e => `${e.reason} (${e.kind})`).sort((a, b) => b[1] - a[1]).slice(0, 4), e => e.minute);
const fmt = d3.utcFormat("%H:%M UTC");
return plot({
  x: {type: "utc", label: "minute (UTC) →"},
  y: {label: "↑ warning events", grid: true, tickFormat: "d"},
  color: {domain: ["burst", "within chance"], range: ["#ef4444", "#f97316"], legend: true},
  marks: [
    Plot.rectY(mins, {x1: d => t(d.minute), x2: d => t(d.minute + 1), y: "events", fill: d => d.burst ? "burst" : "within chance", inset: 0.5, tip: true,
      title: d => `${fmt(t(d.minute))}: ${d.events} warnings about ${d.objects} objects\n` +
        `P(this many or more by chance) = ${d.p < 0.001 ? d.p.toExponential(1) : d.p.toFixed(3)}${d.burst ? ": a burst" : ""}\n` +
        (top.get(d.minute) ?? []).map(([r, n]) => `${n}× ${r}`).join("\n")}),
    Plot.ruleY([k], {stroke: "currentColor", strokeDasharray: "4 3", strokeOpacity: 0.6}),
    Plot.text(mins.length ? [{x: t(mins[0].minute), y: k}] : [], {x: "x", y: "y", text: () => `Poisson limit (${k})`, dy: -6, textAnchor: "start", fill: "currentColor", fillOpacity: 0.7}),
    Plot.ruleY([0]),
  ],
  caption: `${total} warnings in ${span} minutes: ${rate.toFixed(2)} a minute on average. Dispersion index ${disp.toFixed(1)} (about 1 for random arrivals; much more means warnings come in bursts). ` +
    "Minutes with no warnings aren't drawn but are counted in the mean. Each event counts once, at its latest occurrence.",
});