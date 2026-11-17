// MUF against distance for every station: a band is usable beyond the point its line crosses.
const rows = Array.isArray(data) ? data : [];
const bands = [3.6, 7.1, 14.1, 21.1, 28.4];
return plot({
  height: fit?.height ?? 420,
  x: {label: "ground distance of one hop (km) →", grid: true},
  y: {label: "↑ maximum usable frequency (MHz)", grid: true},
  color: {legend: true, domain: ["day (07–17 local solar time)", "twilight", "night"], range: ["#f59e0b", "#a855f7", "#1d4ed8"]},
  marks: [
    Plot.ruleY(bands, {stroke: "#71717a", strokeDasharray: "3,3"}),
    Plot.text(bands, {x: 0, y: d => d, text: d => `${d} MHz`, dy: -5, textAnchor: "start", fontSize: 10, fill: "#71717a"}),
    Plot.lineY(rows, {x: "d_km", y: "muf_mhz", z: "code", stroke: "daylight", strokeWidth: 1.4, strokeOpacity: 0.8}),
    Plot.tip(rows, Plot.pointer({x: "d_km", y: "muf_mhz", stroke: "daylight", href: d => `https://giro.uml.edu/didbase/scaled.php`, target: "_blank",
      channels: {station: "name", code: "code", "distance (km)": "d_km", "MUF (MHz)": "muf_mhz", "sec i": "sec_i", "foF2 (MHz)": "fof2", "hmF2 (km)": "hmf2"}})),
  ],
  caption: "Straight up, the F2 layer returns only frequencies below its critical frequency foF2; slanted, it returns foF2 × sec i, so the MUF climbs with distance until the ray grazes the horizon (each line ends at its station's longest single hop). "
    + "A band whose dashed line lies above foF2 is not heard near the transmitter but is heard far away: the skip zone. Daylight stations (orange) sit far above night ones (blue): sunlight ionises the F2 layer.",
});