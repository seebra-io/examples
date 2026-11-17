// data[0]: volatility {currency, month, days, mean_pct, sd_pct, biggest_pct, vol_pct}
// data[1]: returns {currency, date, month, rate, log_return_pct}
// log return = ln(rate today / rate on the previous fixing) × 100 ≈ % change;
// volatility = sd of the daily log returns × √252 (fixings a year), in %
const W = fit?.width ?? 760, H = fit?.height ?? 460;
const vol = (data[0] || []).filter(d => d.vol_pct != null && d.days >= 5).map(d => ({...d, t: new Date(d.month + "-15")}));
const returns = data[1] || [];
const order = d3.groupSort(returns, v => -d3.deviation(v, d => d.log_return_pct), d => d.currency); // jumpiest first
const wrap = document.createElement("div");
// monthly volatility per currency
wrap.append(plot({
  width: W, height: Math.round(H * 0.55),
  x: {type: "utc", label: "month"},
  y: {label: "↑ annualised volatility (%)", grid: true, nice: true},
  color: {domain: order, scheme: "tableau10", legend: true},
  marks: [
    Plot.lineY(vol, {x: "t", y: "vol_pct", stroke: "currency", strokeWidth: 1.5}),
    Plot.dot(vol, {x: "t", y: "vol_pct", fill: "currency", r: 2.5, tip: true,
                   channels: {month: "month", "fixings": "days", "sd of daily log returns (%)": "sd_pct", "biggest day (%)": "biggest_pct"}}),
    Plot.ruleY([0]),
  ],
}));
// every daily log return, one row per currency
wrap.append(plot({
  width: W, height: Math.round(H * 0.45), marginLeft: 48,
  x: {label: "daily log return (%) →", grid: true},
  y: {label: null, domain: order},
  color: {domain: order, scheme: "tableau10", legend: false},
  caption: "Notice: currencies that end at the same place can differ a lot in how they got there; large days cluster in a few months. "
    + "Caveat: a month holds only about 21 returns, so a monthly volatility is itself a rough estimate; ECB fixings are one snapshot a day.",
  marks: [
    Plot.tickX(returns, {x: "log_return_pct", y: "currency", stroke: "currency", strokeOpacity: 0.35, tip: true,
                         channels: {date: "date", "rate (per EUR)": "rate"}}),
    Plot.ruleX([0]),
  ],
}));
return wrap;