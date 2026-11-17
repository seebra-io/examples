// Three views of the same stages, oldest on the left:
//   1. how many genera lived (range-through) and how many were actually found
//   2. turnover: genera appearing (up) and disappearing (down) in each stage
//   3. how many fossil finds each stage has: diversity follows sampling
const stages = data.slice().sort((a, b) => b.mid_ma - a.mid_ma);
const X = {domain: [252, 62], label: "Million years ago", grid: true};
const H = Math.max(120, Math.floor((fit.height - 12) / 3));
const tipTitle = d => `${d.stage} · ${d.max_ma}–${d.min_ma} Ma\n${d.range_through} genera ranging through, ${d.sampled} found\n` +
                      `+${d.first_appearances} first, −${d.last_appearances} last appearances\n${d.occurrences} finds`;

const genera = plot({
  height: H, x: X, y: {label: "Genera", grid: true},
  marks: [
    Plot.areaY(stages, {x: "mid_ma", y: "range_through", fill: "currentColor", fillOpacity: 0.12}),
    Plot.lineY(stages.flatMap(d => [
      {mid_ma: d.mid_ma, value: d.range_through, series: "living (range-through)"},
      {mid_ma: d.mid_ma, value: d.sampled, series: "found in the stage"}]),
      {x: "mid_ma", y: "value", stroke: "series", strokeWidth: 2}),
    Plot.ruleX([201.4, 66], {strokeDasharray: "4,3"}),
    Plot.tip(stages, Plot.pointerX({x: "mid_ma", y: "range_through", title: tipTitle}))
  ]
});

const turnover = plot({
  height: H, x: X, y: {label: "Genera appearing ↑ / disappearing ↓", grid: true},
  color: {legend: true, domain: ["first appearances", "last appearances"]},
  marks: [
    Plot.rectY(stages, {x1: "max_ma", x2: "min_ma", y: "first_appearances", fill: () => "first appearances", inset: 0.5}),
    Plot.rectY(stages, {x1: "max_ma", x2: "min_ma", y: d => -d.last_appearances, fill: () => "last appearances", inset: 0.5}),
    Plot.ruleY([0]),
    Plot.tip(stages, Plot.pointerX({x: "mid_ma", y: "first_appearances", title: tipTitle}))
  ]
});

const sampling = plot({
  height: H, x: X, y: {label: "Fossil finds", grid: true},
  color: false,
  marks: [
    Plot.rectY(stages, {x1: "max_ma", x2: "min_ma", y: "occurrences", fill: "currentColor", fillOpacity: 0.35, inset: 0.5}),
    Plot.tip(stages, Plot.pointerX({x: "mid_ma", y: "occurrences", title: tipTitle}))
  ]
});

const box = document.createElement("div");
box.style.display = "flex";
box.style.flexDirection = "column";
box.style.gap = "4px";
box.append(genera, turnover, sampling);
return box;