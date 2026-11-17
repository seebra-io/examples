// Every variant: highway energy against city energy per 100 km, by powertrain, with the line where they are equal.
const rows = Array.isArray(data) ? data : [];
const pts = ["petrol", "diesel", "hybrid", "battery electric"];
return plot({
  height: fit?.height ?? 440,
  x: {label: "city cycle: energy per 100 km (kWh, log) →", type: "log", domain: [10, 200], grid: true},
  y: {label: "↑ highway cycle: energy per 100 km (kWh, log)", type: "log", domain: [10, 200], grid: true},
  color: {legend: true, domain: pts, range: ["#dc2626", "#78350f", "#f59e0b", "#2563eb"]},
  marks: [
    Plot.line([[10, 10], [200, 200]], {stroke: "#71717a", strokeDasharray: "4,3"}),
    Plot.text([[150, 150]], {text: () => "highway = city", rotate: -45, dy: -8, fontSize: 10, fill: "#71717a"}),
    Plot.dot(rows, {x: "city_kwh_100km", y: "hwy_kwh_100km", fill: "powertrain", r: 2.2, fillOpacity: 0.55, tip: true,
      href: d => `https://www.fueleconomy.gov/feg/PowerSearch.do?action=noform&path=1&year1=${d.year}&year2=${d.year}&make=${encodeURIComponent(d.make)}&srchtyp=ymm`, target: "_blank",
      channels: {vehicle: d => `${d.year} ${d.make} ${d.model}`, class: "vclass", "city (kWh/100 km)": "city_kwh_100km", "highway (kWh/100 km)": "hwy_kwh_100km",
        "highway / city": "hwy_over_city", "unadjusted city / hwy (MPG or MPGe)": d => `${d.ucity} / ${d.uhighway}`}}),
  ],
  caption: "Petrol and diesel cars (red, brown) sit below the line: they use less per km on the highway. Battery EVs (blue) sit above it: the only cars for which the highway costs more. Hybrids (amber) are in between. "
    + "An engine is inefficient at the low loads of town driving, and every stop turns the car's kinetic energy into brake heat; an electric motor is efficient at any load and recovers most of the braking energy, so what is left for an EV is rolling resistance and air drag, and drag per km grows with v². Click a dot for fueleconomy.gov.",
});