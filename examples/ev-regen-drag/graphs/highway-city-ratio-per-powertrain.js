// The highway/city ratio per powertrain: one tick per variant, with the median.
const rows = Array.isArray(data[0]) ? data[0] : [];
const med = Array.isArray(data[1]) ? data[1] : [];
const pts = ["petrol", "diesel", "hybrid", "battery electric"];
return plot({
  height: fit?.height ?? 260, marginLeft: 110,
  x: {label: "highway energy / city energy (per km) →", domain: [0.4, 1.6], grid: true},
  y: {label: null, domain: pts},
  color: {domain: pts, range: ["#dc2626", "#78350f", "#f59e0b", "#2563eb"], legend: false},
  marks: [
    Plot.ruleX([1], {stroke: "currentColor"}),
    Plot.tickX(rows, {x: "hwy_over_city", y: "powertrain", stroke: "powertrain", strokeOpacity: 0.25}),
    Plot.dot(med, {x: "median_ratio", y: "powertrain", fill: "currentColor", r: 5, tip: true,
      channels: {powertrain: "powertrain", variants: "variants", "median ratio": "median_ratio", "10–90%": d => `${d.q10_ratio} – ${d.q90_ratio}`,
        "highway costs more (% of variants)": "highway_costs_more_pct", "median city (kWh/100 km)": "city_kwh_100km", "median highway (kWh/100 km)": "hwy_kwh_100km"}}),
  ],
  caption: "Left of 1: the highway is cheaper per km; right of 1: dearer. Regenerative braking is what moves hybrids and EVs to the right.",
});