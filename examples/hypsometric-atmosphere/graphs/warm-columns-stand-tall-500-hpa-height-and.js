// Pole to pole: the height of the 500 hPa surface and the 1000–500 hPa thickness, which is the column's mean temperature.
// data[0]: columns {latitude, z500, thickness_m, t_mean_c, below_ground_1000}; data[1]: tropopause {latitude, tropopause_m}
const [cols, trop] = data;
const long = cols.flatMap(d => [{latitude: d.latitude, what: "500 hPa height (m)", v: d.z500, t: d.t_mean_c}, {latitude: d.latitude, what: "1000–500 hPa thickness (m)", v: d.thickness_m, t: d.t_mean_c}]);
return plot({
  height: Math.max(340, (fit?.height ?? 400) - 40),
  x: {label: "latitude (°, along 20° E; south negative) →", grid: true},
  y: {label: "↑ metres", grid: true},
  color: {legend: true, domain: ["500 hPa height (m)", "1000–500 hPa thickness (m)"], range: ["#38bdf8", "#f97316"]},
  marks: [
    Plot.line(long, {x: "latitude", y: "v", stroke: "what", strokeWidth: 2}),
    Plot.dot(long, {x: "latitude", y: "v", fill: "what", r: 3, tip: true, channels: {"layer mean T (°C)": "t", "latitude (°)": "latitude"}}),
  ],
  caption: "Warm columns are tall: the 500 hPa surface stands about 700–800 m higher over the tropics than over the poles, because T̄ = g₀Δz / (R_d ln 2) (hover for each column's mean temperature). "
    + "That slope of the pressure surfaces is what drives the westerly jet streams at mid-latitudes (thermal wind). Caveat: one moment's weather on one meridian; "
    + "where the ground is above 1000 hPa (Antarctica, the African plateaus) the 1000 hPa height is extrapolated below ground.",
});