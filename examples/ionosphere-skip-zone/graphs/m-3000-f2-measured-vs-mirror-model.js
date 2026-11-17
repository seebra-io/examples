// Measured M(3000)F2 against the mirror model's sec i at 3000 km.
const rows = Array.isArray(data) ? data : [];
return plot({
  height: fit?.height ?? 360,
  x: {label: "mirror model: sec i at 3000 km from hmF2 →", domain: [2.4, 4.4], grid: true},
  y: {label: "↑ measured M(3000)F2", domain: [2.4, 4.4], grid: true},
  color: {legend: true, domain: ["day (07–17 local solar time)", "twilight", "night"], range: ["#f59e0b", "#a855f7", "#1d4ed8"]},
  marks: [
    Plot.line([[2.4, 2.4], [4.4, 4.4]], {stroke: "#a1a1aa", strokeDasharray: "4,3"}),
    Plot.dot(rows, {x: "sec_i_3000", y: "m3000", fill: "daylight", r: 5, tip: true,
      channels: {station: "name", "local solar time (h)": "lst", "hmF2 (km)": "hmf2", "foF2 (MHz)": "fof2", "M(3000)F2": "m3000", "MUF(3000) GIRO (MHz)": "mufd",
        "mirror MUF(3000) (MHz)": "muf_mirror_3000", "longest hop (km)": "max_hop_km"}}),
    Plot.text(rows, {x: "sec_i_3000", y: "m3000", text: "code", dx: 7, textAnchor: "start", fontSize: 9}),
  ],
  caption: "The ionosonde's M(3000)F2 factor is read from the full ionogram; the mirror model only knows the peak height. Both say the same thing: a 3000 km hop returns about 3 to 4 times foF2, and a lower layer (smaller hmF2) gives a larger factor, because the ray meets it at a flatter angle. "
    + "Points off the diagonal show what the mirror model misses: real rays bend gradually below the peak, so the true reflection is lower than hmF2.",
});