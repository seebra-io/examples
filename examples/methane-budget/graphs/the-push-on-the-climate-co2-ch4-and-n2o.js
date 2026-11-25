// The three long-lived greenhouse gases' push on the climate since
// pre-industrial times (radiative forcing, W/m²): CO2 dominates, but
// methane is second, and each tonne of it pushes about 80 times harder
// than a tonne of CO2 over 20 years. Methane's direct forcing alone is
// shown; its ozone and water vapour add about half again. Hover a year.
const s = data || {};
const rows = (s.forcing || []).flatMap((r) => [{year: r.year, gas: "CO₂", w: r.co2, amount: `${r.co2_ppm.toFixed(1)} ppm`}, {year: r.year, gas: "CH₄", w: r.ch4, amount: `${r.ch4_ppb.toFixed(0)} ppb`}, {year: r.year, gas: "N₂O", w: r.n2o, amount: `${r.n2o_ppb.toFixed(1)} ppb`}]);
const last = (s.forcing || []).at(-1) || {};
const tot = (last.co2 || 0) + (last.ch4 || 0) + (last.n2o || 0);
return plot({
  height: Math.max(360, (fit?.height ?? 520) - 30), marginLeft: 56,
  x: {label: null, tickFormat: (d) => String(d)},
  y: {label: "↑ radiative forcing since 1750 (W/m²)", grid: true},
  color: {domain: ["CO₂", "CH₄", "N₂O"], range: ["#a1a1aa", "#f97316", "#a78bfa"], legend: true},
  marks: [
    Plot.areaY(rows, {x: "year", y: "w", fill: "gas", order: ["CO₂", "CH₄", "N₂O"], tip: true, channels: {amount: "amount", forcing: (d) => `${d.w.toFixed(3)} W/m²`}}),
    Plot.text([{t: `${last.year}: CO₂ ${(100 * last.co2 / tot).toFixed(0)}%, CH₄ ${(100 * last.ch4 / tot).toFixed(0)}%, N₂O ${(100 * last.n2o / tot).toFixed(0)}% of ${tot.toFixed(2)} W/m²`}], {frameAnchor: "top-left", text: "t", dx: 8, dy: 8, fontWeight: 600}),
  ],
  caption: "Simplified expressions of Myhre et al. (1998) with the CH₄–N₂O band overlap; pre-industrial 278 ppm, 722 ppb, 270 ppb; annual means of NOAA's global monthly means (N₂O from 2001).",
});