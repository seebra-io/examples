// The digits one country at a time: hover a dot for its value; click it to open the country on World Bank Data.
const rows = (Array.isArray(data) ? data : []).filter(d => d.population > 0 && d.land_km2 > 0);
return plot({
  x: {type: "log", label: "land area (km², log scale) →", grid: true, tickFormat: "~s"},
  y: {type: "log", label: "↑ population (log scale)", grid: true, tickFormat: "~s"},
  color: {type: "ordinal", domain: d3.range(1, 10), scheme: "turbo", legend: true, label: "first digit of the population"},
  marks: [
    Plot.dot(rows, {x: "land_km2", y: "population", fill: "d_pop", r: 3.5, href: "link", target: "_blank", tip: true,
      channels: {country: "country", region: "region", "first digit (population)": "d_pop", "first digit (area)": "d_area", year: "pop_year"}}),
  ],
  caption: "Each country on log axes: a first digit is where a value falls between powers of ten, and on a log scale the stretch from 1 to 2 is as wide as 2 to 4. "
    + "Read the colours: digits 1 (dark) are as common as 2 and 3 together. Values are the latest each country reports, so years differ (hover).",
});