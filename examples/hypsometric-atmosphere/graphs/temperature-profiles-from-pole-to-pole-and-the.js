// Temperature against height in 17 columns of air from pole to pole along 20° E, with the tropopause found from the lapse rate.
// data[0]: levels {latitude, p_hpa, temp_c, z_m, surface_hpa}; data[1]: tropopause {latitude, tropopause_m, tropopause_c, tropopause_hpa}
const [rows, trop] = data;
const lev = rows.filter(d => d.p_hpa <= d.surface_hpa).map(d => ({...d, z_km: d.z_m / 1000}));
return plot({
  height: Math.max(420, (fit?.height ?? 500) - 40),
  x: {label: "temperature (°C) →", grid: true},
  y: {label: "↑ geopotential height (km)", grid: true},
  color: {type: "diverging", scheme: "rdbu", domain: [-80, 80], legend: true, label: "latitude (°; south negative)"},
  marks: [
    Plot.line(lev, {x: "temp_c", y: "z_km", z: "latitude", stroke: "latitude", strokeWidth: 1.5, curve: "monotone-y"}),
    Plot.dot(lev, {x: "temp_c", y: "z_km", fill: "latitude", r: 2, tip: true, channels: {"latitude (°)": "latitude", "pressure (hPa)": "p_hpa", "height (m)": "z_m"}}),
    Plot.dot(trop, {x: "tropopause_c", y: d => d.tropopause_m / 1000, symbol: "triangle", r: 5, stroke: "currentColor", fill: "none", tip: true,
      channels: {"latitude (°)": "latitude", "tropopause (hPa)": "tropopause_hpa", "tropopause (m)": "tropopause_m"}}),
  ],
  caption: "Air cools with height by about 6.5 K per km (it expands as pressure falls) up to the tropopause (triangles), where the stratosphere's ozone heating stops the fall. "
    + "The tropical columns (white) are warm, reach −75 °C and a tropopause near 16 km; the polar ones (dark) stop at 8–11 km, lower still under a cold low. Levels below the ground (Antarctica's plateau) are left out. "
    + "Caveat: 13 pressure levels locate the tropopause only to the nearest level.",
});