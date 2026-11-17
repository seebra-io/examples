// The monthly sunspot number since 1749 (grey), its 13-month smoothing (blue), and the cycle minima found in it (orange), numbered as SILSO numbers the cycles.
// data[0]: months {t, tag, ssn, smoothed, cycle}; data[1]: cycles {cycle, start, peak_t, peak_smoothed, length_yr, link}
const [rows, cycles] = data;
return plot({
  height: Math.max(320, (fit?.height ?? 380) - 40),
  x: {label: "year →", tickFormat: "d", grid: true},
  y: {label: "↑ sunspot number (SILSO v2)", grid: true},
  marks: [
    Plot.areaY(rows, {x: "t", y: "ssn", fill: "#a1a1aa", fillOpacity: 0.35}),
    Plot.line(rows, {x: "t", y: "smoothed", stroke: "#38bdf8", strokeWidth: 1.5}),
    Plot.ruleX(cycles, {x: "start", stroke: "#f97316", strokeOpacity: 0.6}),
    Plot.text(cycles, {x: "peak_t", y: "peak_smoothed", text: d => String(d.cycle), dy: -8, fill: "currentColor", href: "link", target: "_blank"}),
    Plot.tip(rows, Plot.pointerX({x: "t", y: "ssn", channels: {month: "tag", "monthly": "ssn", "13-month smoothed": "smoothed", cycle: "cycle"}})),
    Plot.dot(cycles, {x: "peak_t", y: "peak_smoothed", r: 2.5, fill: "#38bdf8", tip: true, channels: {cycle: "cycle", "started": "start", "length (yr)": "length_yr", "rise (yr)": "rise_yr"}}),
  ],
  caption: "Twenty-five cycles, none alike: the peaks range from about 80 (the Dalton minimum, cycles 5–6, around 1800) to 285 (cycle 19, 1958). Orange lines: minima of the smoothed series (the lowest within four years). "
    + "Click a cycle number for its Wikipedia page. Caveat: before about 1850 the monthly values rest on few observers, and the series is SILSO's 2015 recalibration (version 2), not the historic Wolf numbers.",
});