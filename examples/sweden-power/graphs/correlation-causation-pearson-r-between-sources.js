// data[0]: correlations {variable, nuclear, hydro, wind, solar, load, net_export} (Pearson r)
// data[1]: wide {time, nuclear, hydro, wind, solar, load, net_export} in MW, per quarter hour
const W = fit?.width ?? 820, H = fit?.height ?? 420;
const matrix = data[0] || [], wide = (data[1] || []).map(d => ({...d, t: new Date(d.time)}));
const vars = matrix.map(r => r.variable);
const cells = matrix.flatMap(r => vars.map(v => ({a: r.variable, b: v, r: r[v]})));
// the strongest pair (off the diagonal) gets a scatter, coloured by the hour
const top = d3.greatest(cells.filter(c => c.a < c.b && c.r != null), c => Math.abs(c.r)) || {a: vars[0], b: vars[1], r: null};
const label = v => v === "net_export" ? "net export" : v;
const wrap = document.createElement("div");
wrap.style.display = "flex"; wrap.style.flexWrap = "wrap"; wrap.style.gap = "8px";
const side = Math.max(220, Math.min(H - 60, W / 2 - 8));
wrap.append(plot({
  width: side, height: side, marginLeft: 70, marginBottom: 60,
  x: {label: null, domain: vars, tickFormat: label, tickRotate: -30},
  y: {label: null, domain: vars, tickFormat: label},
  color: {type: "linear", scheme: "RdBu", domain: [-1, 1], label: "Pearson r"},
  marks: [
    Plot.cell(cells, {x: "b", y: "a", fill: "r", inset: 0.5, tip: true,
                      channels: {pair: d => `${label(d.a)} × ${label(d.b)}`}}),
    Plot.text(cells, {x: "b", y: "a", text: d => d.r == null ? "–" : d3.format("+.2f")(d.r), fill: d => Math.abs(d.r) > 0.6 ? "white" : "black"}),
  ],
}));
wrap.append(plot({
  width: Math.max(260, W - side - 8), height: side,
  x: {label: `${label(top.b)} (MW) →`, grid: true},
  y: {label: `↑ ${label(top.a)} (MW)`, grid: true},
  color: {type: "linear", scheme: "viridis", label: "hour of the day", legend: true},
  caption: `Notice: ${label(top.a)} and ${label(top.b)} move together most (r ${top.r == null ? "–" : d3.format("+.2f")(top.r)}); `
    + "colour shows both may simply follow the clock, as demand and weather change through the day: a correlation is not a cause. "
    + "Caveat: one day of quarter hours, each close to the last, is far less evidence than the number of points suggests.",
  marks: [
    Plot.line(wide, {x: top.b, y: top.a, stroke: "currentColor", strokeOpacity: 0.2}),
    Plot.dot(wide, {x: top.b, y: top.a, fill: d => d.t.getHours() + d.t.getMinutes() / 60, r: 3.5, tip: true,
                    channels: {time: d => d3.timeFormat("%H:%M")(d.t)}}),
  ],
}));
return wrap;