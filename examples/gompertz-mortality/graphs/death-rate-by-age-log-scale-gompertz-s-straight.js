// The death rate by age, on a log scale: Eurostat's life tables for eight
// countries, 2023. Gompertz's law says ln m(x) rises in a straight line
// with age, and from about 35 to 85 it does: the risk of dying doubles
// every 6.6 to 10 years (the dashed fits), in every country, for women and
// men. Countries differ mostly in the level of the line (Bulgaria and
// Lithuania lie above Spain and Sweden), much less in its slope. Off the
// line: infancy, the young men's "accident hump" around 20, and the
// slowing at the oldest ages. Hover a point for its rate; click for the
// Eurostat table. Buttons switch the year.
const [rows, fits] = [data[0] || [], data[1] || []];
const W = fit?.width ?? 900, Hh = Math.max(420, (fit?.height ?? 520) - 40);
const wrap = document.createElement("div");
const bar = document.createElement("div");
bar.style.cssText = "display:flex;gap:6px;margin:4px 0;font:12px sans-serif";
const holder = document.createElement("div");
wrap.append(bar, holder);
const countries = [...new Set(rows.map(d => d.country))].sort();
const draw = year => {
  holder.innerHTML = "";
  const r = rows.filter(d => d.year === year);
  const f = fits.filter(d => d.year === year);
  const lines = f.flatMap(d => [35, 84].map(x => ({country: d.country, sex: d.sex, age: x, mx: Math.exp(d.ln_a + d.b * x)})));
  holder.append(plot({
    width: W, height: Hh,
    fx: {domain: ["women", "men"], label: null},
    x: {label: "age (years) →", domain: [0, 100], grid: true},
    y: {type: "log", label: "↑ death rate m(x) (deaths per person-year, log)", grid: true, tickFormat: "~g"},
    color: {domain: countries, scheme: "tableau10", legend: true},
    marks: [
      Plot.line(r, {fx: "sex", x: "age", y: "mx", z: "country", stroke: "country", strokeWidth: 1.2, strokeOpacity: 0.8}),
      Plot.line(lines, {fx: "sex", x: "age", y: "mx", z: "country", stroke: "currentColor", strokeDasharray: "3 3", strokeOpacity: 0.6}),
      Plot.dot(r, {fx: "sex", x: "age", y: "mx", fill: "country", r: 1.6, href: "link", target: "_blank", tip: true,
        channels: {country: "country", sex: "sex", year: "year", "age group": d => d.open_age ? `${d.age}+ (open)` : d.age}}),
    ],
    caption: `${year}: dashed lines are Gompertz fits over ages 35–84 (m(x) = a·e^(bx)).`,
  }));
};
[...new Set(rows.map(d => d.year))].sort().forEach(y => {
  const b = document.createElement("button");
  b.textContent = y;
  b.style.cssText = "padding:2px 10px;border:1px solid currentColor;border-radius:4px;background:transparent;color:inherit;cursor:pointer";
  b.onclick = () => draw(y);
  bar.append(b);
});
draw(d3.max(rows, d => d.year));
return wrap;