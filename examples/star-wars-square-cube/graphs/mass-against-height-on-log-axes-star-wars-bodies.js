// The square-cube law against Star Wars: mass against height on log axes, every weighed character.
// Three lines through Luke Skywalker (172 cm, 77 kg): slope 3 (a human scaled up or down, the square-cube law),
// slope 2 (Quetelet's rule for adult humans, the basis of the BMI), and the slope fitted on everyone but Jabba.
// data[0]: odd {name, species, group, homeworld_name, height_cm, mass_kg, bmi, expected_kg, heavier_by, cube_kg, films_n, wiki}; data[1]: law {grp, slope, se, intercept, n}
const [rows, law] = data;
const fitRow = law.find(d => d.grp === "all but Jabba");
const hs = d3.range(60, 270, 5);
const lines = [
  ...hs.map(h => ({h, m: 77 * (h / 172) ** 3, line: "slope 3: a scaled human (square-cube law)"})),
  ...hs.map(h => ({h, m: 77 * (h / 172) ** 2, line: "slope 2: constant BMI (Quetelet)"})),
  ...hs.map(h => ({h, m: 10 ** (fitRow.intercept + fitRow.slope * Math.log10(h)), line: `fitted: slope ${fitRow.slope} ± ${fitRow.se} (n = ${fitRow.n}, without Jabba)`})),
];
return plot({
  height: Math.max(440, (fit?.height ?? 520) - 40),
  x: {type: "log", label: "height (cm, log scale) →", domain: [60, 270], grid: true},
  y: {type: "log", label: "↑ mass (kg, log scale)", grid: true},
  color: {domain: ["human", "alien", "droid"], range: ["#3b82f6", "#f97316", "#71717a"], legend: true, label: "who"},
  marks: [
    Plot.line(lines, {x: "h", y: "m", z: "line", stroke: "currentColor", strokeOpacity: 0.55, strokeDasharray: d => d.line.startsWith("fitted") ? null : "4,3"}),
    Plot.text(lines.filter(d => d.h === 255), {x: "h", y: "m", text: "line", textAnchor: "end", dy: -6, fontSize: 10, fill: "currentColor"}),
    Plot.dot(rows, {x: "height_cm", y: "mass_kg", fill: "group", r: 4, fillOpacity: 0.85, stroke: "white", strokeWidth: 0.5, href: "wiki", target: "_blank", tip: true,
      channels: {name: "name", species: "species", homeworld: "homeworld_name", "BMI (kg/m²)": "bmi", "the law predicts (kg)": "expected_kg",
        "× heavier than predicted": "heavier_by", "a scaled Luke would weigh (kg)": "cube_kg", films: "films_n"}}),
    Plot.text(rows.filter(d => d.heavier_by > 1.45 || d.heavier_by < 0.6 || d.height_cm < 80 || d.height_cm > 225), {x: "height_cm", y: "mass_kg", text: "name", dx: 6, textAnchor: "start", fontSize: 9, fill: "currentColor"}),
  ],
  caption: "If tall characters were humans scaled up, they would follow the steep dashed line: twice as tall, 8 times as heavy. "
    + `Star Wars bodies follow a slope of ${fitRow.slope}: twice as tall is only ${(2 ** fitRow.slope).toFixed(1)} times as heavy, flatter even than the BMI's slope 2. `
    + "Tall aliens (Kaminoans, Gungans, Wat Tambor) are designed lanky, and small ones (Yoda, droids) dense: costumes, puppets and CGI, not biology. "
    + "Hover a character; click for its Wookieepedia page. Data: SWAPI (swapi.info), fans' record of Lucasfilm's films (Star Wars © Lucasfilm): masses are fan estimates, not measurements.",
});