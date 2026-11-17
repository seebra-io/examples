// data[0]: indexed {date, currency, rate (units per euro), index (100 at the start)}
// data[1]: summary {currency, first, last, low, high, days, change_pct, sd_pct, vol_pct, ...}
const W = fit?.width ?? 760, H = fit?.height ?? 420;
const rows = (data[0] || []).map(d => ({...d, t: new Date(d.date)}));
const summary = data[1] || [];
const order = summary.map(s => s.currency); // biggest gain of the euro first
const change = new Map(summary.map(s => [s.currency, s.change_pct]));
const pct = d3.format("+.1f");
return plot({
  width: W, height: H, marginRight: 80,
  x: {type: "utc", label: "ECB fixing date"},
  y: {label: "↑ units per euro, indexed (start = 100)", grid: true, nice: true},
  color: {domain: order, scheme: "tableau10", tickFormat: c => `${c} ${pct(change.get(c))}%`},
  marks: [
    Plot.ruleY([100], {stroke: "currentColor", strokeOpacity: 0.5}),
    Plot.lineY(rows, {x: "t", y: "index", stroke: "currency", strokeWidth: 1.5, tip: true,
                      channels: {"rate (per EUR)": "rate"}}),
    Plot.text(rows, Plot.selectLast({x: "t", y: "index", z: "currency", fill: "currency", textAnchor: "start", dx: 4,
                                     text: d => `${d.currency} ${pct(change.get(d.currency))}%`})),
  ],
});