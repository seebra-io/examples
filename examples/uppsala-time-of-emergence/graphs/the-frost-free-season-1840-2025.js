// The consequence on the ground: the frost-free season (last spring frost to first autumn frost), per year, with a 15-year running mean.
// data: frost {year, frost_nights, last_spring_frost_doy, first_autumn_frost_doy, frost_free_days}
const rows = (Array.isArray(data) ? data : []).filter(d => d.frost_free_days != null);
const date = doy => doy == null ? "" : d3.utcFormat("%b %-d")(new Date(Date.UTC(2001, 0, doy)));
const pts = rows.map(d => ({...d, last_frost: date(d.last_spring_frost_doy), first_frost: date(d.first_autumn_frost_doy)}));
const early = d3.mean(rows.filter(d => d.year <= 1900), d => d.frost_free_days);
const late = d3.mean(rows.filter(d => d.year >= 1996), d => d.frost_free_days);
return plot({
  height: Math.max(380, (fit?.height ?? 420) - 40),
  x: {label: "year →", tickFormat: "d", grid: true},
  y: {label: "↑ frost-free season (days between the last spring and first autumn night below 0 °C)", grid: true},
  marks: [
    Plot.ruleY([early], {stroke: "#64748b", strokeDasharray: "4,3"}),
    Plot.ruleY([late], {stroke: "#dc2626", strokeDasharray: "4,3"}),
    Plot.text([{y: early, t: `1840–1900 mean: ${Math.round(early)} days`}, {y: late, t: `1996–2025 mean: ${Math.round(late)} days`}],
      {y: "y", text: "t", frameAnchor: "left", dy: -6, dx: 4, fill: (d, i) => i ? "#dc2626" : "#64748b"}),
    Plot.dot(pts, {x: "year", y: "frost_free_days", r: 2.5, fill: "#0ea5e9", fillOpacity: 0.7, tip: true,
      channels: {"last spring frost": "last_frost", "first autumn frost": "first_frost", "frost nights in the year": "frost_nights"}}),
    Plot.lineY(pts, Plot.windowY({k: 15, anchor: "middle"}, {x: "year", y: "frost_free_days", stroke: "currentColor", strokeWidth: 2})),
  ],
  caption: `Uppsala's frost-free season has grown from about ${Math.round(early)} to ${Math.round(late)} days, about ${Math.round(late - early)} days, roughly a month more: the last spring frost now comes about two and a half weeks earlier (around May 7 instead of May 25) and the first autumn frost about two weeks later. `
    + "A frost night here is a daily minimum below 0 °C at the screen (about 2 m); ground frost comes on more nights. Years with gaps in the record are left out."
});
