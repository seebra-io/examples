// Every hour of May and June 2026: the day-ahead price against the residual load, with the bins' median and 10-90% band.
const hours = Array.isArray(data[0]) ? data[0] : [];
const bins = Array.isArray(data[1]) ? data[1] : [];
const link = "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=en&c=DE";
return plot({
  height: fit?.height ?? 420,
  x: {label: "residual load = load − wind − solar (GW) →", grid: true},
  y: {label: "↑ day-ahead price (EUR/MWh)", grid: true},
  color: {type: "linear", scheme: "YlOrRd", label: "solar (GW)", legend: true},
  marks: [
    Plot.ruleY([0], {stroke: "currentColor", strokeOpacity: 0.6}),
    Plot.areaY(bins, {x: "bin_gw", y1: "p10_price", y2: "p90_price", fill: "#2563eb", fillOpacity: 0.12}),
    Plot.dot(hours, {x: "residual_gw", y: "price", fill: "solar_gw", r: 2.2, fillOpacity: 0.75, href: () => link, target: "_blank",
      tip: true, channels: {hour: "time", "load (GW)": "load_gw", "wind (GW)": "wind_gw", "solar (GW)": "solar_gw",
        "gas (GW)": "gas_gw", "lignite (GW)": "lignite_gw", "net imports (GW)": "imports_gw", "renewable share (%)": "renewable_share_pct"}}),
    Plot.line(bins, {x: "bin_gw", y: "median_price", stroke: "#1d4ed8", strokeWidth: 2.5}),
    Plot.dot(bins, {x: "bin_gw", y: "median_price", fill: "#1d4ed8", r: 3.5, tip: true,
      channels: {"bin centre (GW)": "bin_gw", hours: "hours", "median price": "median_price", "10% price": "p10_price", "90% price": "p90_price",
        "hours below 0 EUR (%)": "negative_pct", "gas (GW)": "gas_gw", "lignite (GW)": "lignite_gw", "net imports (GW)": "imports_gw"}}),
  ],
  caption: "The price is not set by how much power is used but by what is left once wind and sun have been taken: the residual load picks the last (marginal) plant in the merit order, and that plant's running cost becomes everyone's price. "
    + "Below zero residual load (bright dots: sunny middays) the price sits at or below 0; it climbs steeply as the first plants are needed, flattens from 20 to 35 GW, and turns up again above 35 GW where gas and pumped hydro have to run. Hover a dot for the hour, a blue point for its bin.",
});