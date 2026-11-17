// Machines scale too: starship cost against length on log axes, coloured by hyperdrive class (lower is faster).
// data: ships {name, model, manufacturer, starship_class, cost, length_m, crew_n, hyperdrive, mglt, films_n, cost_per_m3, wiki}
const rows = (Array.isArray(data) ? data : []).filter(d => d.cost > 0 && d.length_m > 0);
const xs = rows.map(d => Math.log10(d.length_m)), ys = rows.map(d => Math.log10(d.cost));
const mx = d3.mean(xs), my = d3.mean(ys);
const b = d3.sum(xs, (x, i) => (x - mx) * (ys[i] - my)) / d3.sum(xs, x => (x - mx) ** 2);
const ext = d3.extent(rows, d => d.length_m);
const line = d3.range(Math.log10(ext[0]), Math.log10(ext[1]) + 0.01, 0.1).map(lx => ({L: 10 ** lx, c: 10 ** (my + b * (lx - mx))}));
return plot({
  height: Math.max(400, (fit?.height ?? 460) - 40),
  x: {type: "log", label: "length (m, log scale) →", grid: true},
  y: {type: "log", label: "↑ cost (credits, log scale)", grid: true},
  color: {type: "linear", scheme: "viridis", reverse: true, legend: true, label: "hyperdrive class (lower is faster)"},
  marks: [
    Plot.line(line, {x: "L", y: "c", stroke: "currentColor", strokeDasharray: "4,3"}),
    Plot.dot(rows, {x: "length_m", y: "cost", fill: "hyperdrive", r: d => 3 + Math.log10(1 + (d.crew_n ?? 1)), stroke: "currentColor", strokeWidth: 0.3, href: "wiki", target: "_blank", tip: true,
      channels: {name: "name", class: "starship_class", manufacturer: "manufacturer", "crew": "crew_n", "MGLT (sublight)": "mglt", "credits per m³ (length³)": "cost_per_m3", films: "films_n"}}),
    Plot.text(rows, {x: "length_m", y: "cost", text: "name", dx: 7, textAnchor: "start", fontSize: 9, fill: "currentColor"}),
  ],
  caption: `Cost grows as length^${b.toFixed(2)} (dashed), from a 7 m starfighter to the 120 km Death Star: far below the length³ a price by volume would give, so the big ships are cheap per cubic metre. `
    + "Hyperdrive class hardly follows the price: the Millennium Falcon (class 0.5) is among the cheapest and fastest. Ten ships have no cost ('unknown'), among them Slave 1 and the TIE Advanced. "
    + "Click a ship for Wookieepedia.",
});