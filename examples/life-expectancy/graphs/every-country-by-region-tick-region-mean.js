// Every country's life expectancy, one row per region; tick: the region's mean
const [countries, regions] = data;
const incomes = ["Low income", "Lower middle income", "Upper middle income", "High income"];
const mean = new Map((regions || []).map(r => [r.region, r]));
return plot({
  marginLeft: 190,
  x: {label: "life expectancy at birth (years)", grid: true},
  y: {axis: null},
  color: {domain: incomes, range: ["#f97316", "#facc15", "#34d399", "#38bdf8"], unknown: "#71717a"},
  marks: [
    Plot.dot(countries, Plot.dodgeY("middle", {fy: "region", x: "years", fill: "income", r: 3, fillOpacity: 0.8,
      tip: true, title: d => { const r = mean.get(d.region);
        return `${d.country} (${d.iso3}): ${d.years} years in ${d.year}\n${d.income} · GDP per capita ${d.gdp ? "$" + d3.format(",.0f")(d.gdp) : "missing"}\n` +
          (r ? `${d.region} mean ${r.mean_years} (${d3.format("+.1f")(d.years - r.mean_years)})` : ""); }})),
    Plot.tickX(regions, {fy: "region", x: "mean_years", stroke: "currentColor", strokeWidth: 2,
      tip: true, title: r => `${r.region}: mean ${r.mean_years} years over ${r.countries} countries\nfrom ${r.lowest} to ${r.highest}`}),
  ],
  fy: {label: null, domain: (regions || []).map(r => r.region), tickSize: 0},
});