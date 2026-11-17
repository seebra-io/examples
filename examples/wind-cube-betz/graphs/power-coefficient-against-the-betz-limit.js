// The power coefficient against wind speed, with the Betz limit.
const bins = Array.isArray(data) ? data : [];
return plot({
  height: fit?.height ?? 320,
  x: {label: "wind speed at 100 m (m/s) →", grid: true, domain: [0, 22]},
  y: {label: "↑ Cp = output / power in the wind", grid: true, domain: [0, 0.8]},
  marks: [
    Plot.ruleY([16 / 27], {stroke: "#a855f7", strokeWidth: 2}),
    Plot.text([[21, 16 / 27]], {text: () => "Betz limit 16/27 = 0.593", dy: -6, textAnchor: "end", fontSize: 10, fill: "#a855f7"}),
    Plot.areaY(bins, {x: "v_bin", y1: d => d.p25_mw / d.p_wind_mw, y2: d => d.p75_mw / d.p_wind_mw, fill: "#2563eb", fillOpacity: 0.12}),
    Plot.line(bins, {x: "v_bin", y: "median_cp", stroke: "#2563eb", strokeWidth: 2.5}),
    Plot.dot(bins, {x: "v_bin", y: "median_cp", fill: "#2563eb", r: 3, tip: true,
      channels: {"bin (m/s)": "v_bin", hours: "hours", "median Cp": "median_cp", "median output (MW)": "median_mw", "power in the wind (MW)": "p_wind_mw"}}),
  ],
  caption: "Why can a turbine never take all the wind's power? To extract energy it must slow the air, and air that stops would block the air behind it. Betz showed the best is to slow it to a third of the free speed downstream, which captures 16/27 of the power. "
    + "This farm peaks around 7–9 m/s (wake losses between turbines, electrical losses and the grid-cell wind included), then Cp falls as 1/v³ once output is capped at rated power.",
});