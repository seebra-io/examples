// GDP per capita per country and year (current US$, World Bank)
return plot({
  marginRight: 70,
  x: {label: "year", tickFormat: "d"},
  y: {label: "GDP per capita (current US$)", grid: true, tickFormat: "~s"},
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(data, {x: "year", y: "gdp", stroke: "country", strokeWidth: 2}),
    Plot.text(data, Plot.selectLast({x: "year", y: "gdp", z: "country", text: "country", fill: "country", textAnchor: "start", dx: 4})),
    Plot.dot(data, Plot.pointerX({x: "year", y: "gdp", fill: "country", r: 4,
      tip: true, title: d => `${d.country} ${d.year}\n$${d3.format(",")(d.gdp)} per person`})),
  ],
});