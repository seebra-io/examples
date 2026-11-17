// What runs at each level of residual load (bin means): the plants that move are the ones that set the price.
const bins = Array.isArray(data) ? data : [];
const kinds = [["lignite_gw", "lignite"], ["coal_gw", "hard coal"], ["gas_gw", "gas"], ["pump_gw", "pumped hydro"], ["imports_gw", "net imports"]];
const long = bins.flatMap(b => kinds.map(([k, label]) => ({bin_gw: b.bin_gw, kind: label, gw: Math.max(0, b[k] ?? 0), raw: b[k],
  hours: b.hours, median_price: b.median_price})));
return plot({
  height: fit?.height ?? 380,
  x: {label: "residual load (GW) →", grid: true},
  y: {label: "↑ mean output in the bin (GW; net exports drawn as 0)", grid: true},
  color: {legend: true, domain: kinds.map(k => k[1]), range: ["#78350f", "#525252", "#f97316", "#0891b2", "#7c3aed"]},
  marks: [
    Plot.areaY(long, {x: "bin_gw", y: "gw", fill: "kind", fillOpacity: 0.85, order: kinds.map(k => k[1])}),
    Plot.tip(long, Plot.pointerX(Plot.stackY({x: "bin_gw", y: "gw", fill: "kind", order: kinds.map(k => k[1]),
      channels: {source: "kind", "mean output (GW)": "raw", "hours in bin": "hours", "median price (EUR/MWh)": "median_price"}}))),
    Plot.ruleY([0]),
  ],
  caption: "Net imports swing the most: at negative residual load Germany exports 10–15 GW into the coupled European market, at 50 GW it imports 12–14 GW, so neighbours' plants are part of the same merit order. "
    + "Lignite stays on (1.5–9 GW, must-run and slow), while gas (1.5 → 9 GW) and pumped hydro (0 → 6 GW) rise steeply only at the top: they are the marginal suppliers in the evening, and their costs are the steep end of the price curve. "
    + "Caveat: public net generation (Energy-Charts); industrial self-supply and the actual bids are not in the data.",
});