// Life expectancy against GDP per capita (log scale), with the least-squares line
// and its 95% confidence band (for the line, not for single countries).
const rows = data;
const f = rows[0] ?? {};
const incomes = ["Low income", "Lower middle income", "Upper middle income", "High income"];
const fit_ = [...rows].sort((a, b) => a.gdp - b.gdp);
return plot({
  height: (fit?.height ?? 400) - 36,
  x: {type: "log", label: "GDP per capita (current US$, log scale)", tickFormat: "~s", grid: true},
  y: {label: "life expectancy at birth (years)", grid: true},
  color: {domain: incomes, range: ["#f97316", "#facc15", "#34d399", "#38bdf8"], unknown: "#71717a"},
  marks: [
    Plot.areaY(fit_, {x: "gdp", y1: "lo", y2: "hi", fill: "currentColor", fillOpacity: 0.12}),
    Plot.lineY(fit_, {x: "gdp", y: "fitted", stroke: "currentColor", strokeWidth: 1.5}),
    Plot.dot(rows, {x: "gdp", y: "years", fill: "income", r: 3.5, fillOpacity: 0.8,
      tip: true, title: d => `${d.country} (${d.region})\n${d.years} years · $${d3.format(",.0f")(d.gdp)} per person\n` +
        `line predicts ${d.fitted.toFixed(1)}: ${d3.format("+.1f")(d.residual)} years ${d.residual >= 0 ? "longer" : "shorter"} than its income suggests`}),
  ],
  caption: `${f.slope?.toFixed(1)} more years per tenfold GDP per capita, R² ${f.r2?.toFixed(2)}, ${f.n} countries. A correlation, not a cause: health systems, education and history drive both, and causation runs both ways. Look at the countries far from the line.`,
});