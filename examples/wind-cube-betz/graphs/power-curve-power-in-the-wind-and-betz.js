// Every hour: output against wind speed, with the bin medians, the available power ½ρAv³ and the Betz limit.
const hours = Array.isArray(data[0]) ? data[0] : [];
const bins = Array.isArray(data[1]) ? data[1] : [];
const link = "https://bmrs.elexon.co.uk/actual-generation-by-bm-unit?bmUnit=T_WTMSO-1";
return plot({
  height: fit?.height ?? 420,
  x: {label: "wind speed at 100 m, ERA5 (m/s) →", grid: true, domain: [0, 22]},
  y: {label: "↑ power (MW)", grid: true, domain: [0, 400]},
  marks: [
    Plot.ruleY([210], {stroke: "#71717a", strokeDasharray: "4,3"}),
    Plot.text([[1, 210]], {text: () => "installed 210 MW (35 × 6 MW)", dy: -6, textAnchor: "start", fontSize: 10, fill: "#71717a"}),
    Plot.line(bins, {x: "v_bin", y: "p_wind_mw", stroke: "#a855f7", strokeDasharray: "2,3", clip: true}),
    Plot.line(bins, {x: "v_bin", y: "betz_limit_mw", stroke: "#a855f7", strokeWidth: 2, clip: true}),
    Plot.dot(hours, {x: "v", y: "mw", r: 1.6, fill: "#2563eb", fillOpacity: 0.35, href: () => link, target: "_blank", tip: true,
      channels: {hour: "time", "wind (m/s)": "v", "output (MW)": "mw", "in the wind (MW)": "p_wind_mw", "Cp": "cp", "air density (kg/m³)": "rho", "settlement run": "run"}}),
    Plot.line(bins, {x: "v_bin", y: "median_mw", stroke: "#dc2626", strokeWidth: 2.5}),
    Plot.dot(bins, {x: "v_bin", y: "median_mw", fill: "#dc2626", r: 3, tip: true,
      channels: {"bin (m/s)": "v_bin", hours: "hours", "median (MW)": "median_mw", "25–75%": d => `${d.p25_mw} – ${d.p75_mw}`, "median Cp": "median_cp", "Betz limit (MW)": "betz_limit_mw", "energy share (%)": "energy_share_pct"}}),
  ],
  caption: "Purple dashed: all the power in the wind crossing the rotors, ½ρAv³; purple solid: the Betz limit, 16/27 of it, the most any rotor can take. "
    + "The farm (red median) follows the cube law from cut-in near 3 m/s, rising steeply, then flattens near 195 MW (rated output net of electrical losses) from about 12.5 m/s: above that the blades pitch to spill power, so the cube is cut off on purpose. Scatter: ERA5 wind is a 30 km grid value, not the hub's own anemometer.",
});