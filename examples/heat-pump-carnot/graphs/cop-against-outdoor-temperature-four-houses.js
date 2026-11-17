// Measured daily COP against outdoor temperature, per system, with the Carnot limit (dashed, at each system's mean flow temperature bins).
const days = Array.isArray(data[0]) ? data[0] : [];
const bins = Array.isArray(data[1]) ? data[1] : [];
const sys = ["Cheshire (underfloor + radiators)", "Angus (radiators)", "Newcastle (radiators)", "London (radiators)"];
const link = id => `https://heatpumpmonitor.org/system/view?id=${id}`;
return plot({
  height: fit?.height ?? 420,
  x: {label: "daily mean outdoor temperature (°C) →", grid: true},
  y: {label: "↑ COP (heat out / electricity in)", grid: true, domain: [0, 12]},
  color: {legend: true, domain: sys, range: ["#16a34a", "#2563eb", "#f59e0b", "#dc2626"]},
  marks: [
    Plot.dot(days, {x: "outside_c", y: "cop", fill: "system", r: 1.8, fillOpacity: 0.45, href: d => link(d.system_id), target: "_blank", tip: true,
      channels: {day: "day", system: "system", "COP": "cop", "Carnot COP": "cop_carnot", "share of Carnot": "carnot_fraction", "flow (°C)": "flow_c", "outdoor (°C)": "outside_c", "heat (kWh)": "heat_kwh", "electricity (kWh)": "elec_kwh"}}),
    Plot.line(bins, {x: "out_bin", y: "cop", stroke: "system", strokeWidth: 2.5}),
    Plot.line(bins, {x: "out_bin", y: "cop_carnot", stroke: "system", strokeDasharray: "4,3", strokeWidth: 1.2}),
  ],
  caption: "The same heat pump model in four houses. Solid: measured COP per 2 K band; dashed: the Carnot limit for the same flow and outdoor temperatures (cut at 12). "
    + "Each house's COP falls as it gets colder, but the gap between the houses is larger than the effect of the weather: the house with underfloor heating (green) runs its water about 9 K cooler than London (red) and gets about 1.45 times the heat per kWh. Click a dot to open the system on heatpumpmonitor.org.",
});