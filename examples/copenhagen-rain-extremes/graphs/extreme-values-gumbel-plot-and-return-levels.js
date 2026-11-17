// Gumbel plot: each year's wettest day against its plotting position on the Gumbel scale -ln(-ln p).
// A Gumbel distribution is a straight line here; orange is the fit (method of moments), the band its 95% interval.
// data[0]: gumbel {period, year, date, max_mm, return_period, gumbel_y, fitted_mm}; data[1]: levels {period, T, level_mm, lo_mm, hi_mm}
const [rows, levels] = data;
const all = rows.filter(d => d.period === "all years");
const fitAll = levels.filter(d => d.period === "all years");
const Ts = [1.01, 1.1, 1.5, 2, 5, 10, 20, 50, 100, 200];
const yOf = T => -Math.log(-Math.log(1 - 1 / T));
return plot({
  height: Math.max(360, (fit?.height ?? 440) - 40),
  x: {label: "return period (years, Gumbel scale) →", ticks: Ts.map(yOf), tickFormat: y => `${Ts.find(T => Math.abs(yOf(T) - y) < 1e-6)}`, grid: true,
      domain: [-1.7, yOf(250)]},
  y: {label: "↑ the year's wettest day (mm)", grid: true},
  marks: [
    Plot.areaY(fitAll, {x: "gumbel_y", y1: "lo_mm", y2: "hi_mm", fill: "#f97316", fillOpacity: 0.15}),
    Plot.line(all, {x: "gumbel_y", y: "fitted_mm", stroke: "#f97316", strokeWidth: 2}),
    Plot.line(fitAll, {x: "gumbel_y", y: "level_mm", stroke: "#f97316", strokeWidth: 2, strokeDasharray: "4,3"}),
    Plot.dot(fitAll, {x: "gumbel_y", y: "level_mm", fill: "#f97316", r: 3, tip: true,
      title: d => `${d.T}-year level: ${d.level_mm} mm (95%: ${d.lo_mm}–${d.hi_mm})`}),
    Plot.dot(all, {x: "gumbel_y", y: "max_mm", fill: "#38bdf8", r: 3.5, tip: true,
      title: d => `${d.year}: ${d.max_mm} mm on ${d.date}\nempirical return period ≈ ${d.return_period} years (Gringorten)\nGumbel fit at this position: ${d.fitted_mm} mm`}),
  ],
  caption: "Notice: the dots follow the line, so a 1-in-100-year day is extrapolated from 86 years of record; the band widens fast beyond the data. "
    + "A 100-year level is the one with a 1% chance each year, not one per century. "
    + "Caveats: ERA5 is a ~30 km reanalysis grid cell, which smooths cloudbursts: on 2 July 2011 Copenhagen stations measured over 100 mm in hours, ERA5 has 20 mm. "
    + "The fit assumes the climate doesn't change (compare the two halves in the table).",
});