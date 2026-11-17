// Each year's wettest day since 1940, with the fitted 10- and 50-year levels.
// data[0]: maxima {year, date, max_mm}; data[1]: levels {period, T, level_mm}
const [rows, levels] = data;
const lv = levels.filter(d => d.period === "all years" && (d.T === 10 || d.T === 50));
return plot({
  height: Math.max(260, (fit?.height ?? 320) - 40),
  x: {label: null, tickFormat: "d"},
  y: {label: "↑ wettest day of the year (mm)", grid: true},
  marks: [
    Plot.ruleX(rows, {x: "year", y: "max_mm", stroke: "#38bdf8", strokeWidth: 3, tip: true,
      title: d => `${d.year}: ${d.max_mm} mm on ${d.date}`}),
    Plot.ruleY(lv, {y: "level_mm", stroke: "#f97316", strokeDasharray: "4,3"}),
    Plot.text(lv, {y: "level_mm", frameAnchor: "right", dy: -6, text: d => `${d.T}-year level ${d.level_mm} mm`, fill: "#f97316"}),
    Plot.ruleY([0]),
  ],
  caption: "Exceedances of the 10-year level should come about once a decade, at random: count them. Next step: the levels per half-century in the table.",
});