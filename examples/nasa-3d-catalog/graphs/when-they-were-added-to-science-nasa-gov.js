// Models per month of upload. Aware: this is when a file reached the new
// science.nasa.gov (the site was rebuilt in 2023-2025 and the older NASA 3D
// Resources were moved over in bulk in spring 2025), not when the model was made.
// data: models {added, collection}
const rows = (Array.isArray(data) ? data : []).filter(d => d.added).map(d => ({...d, month: d.added.slice(0, 7)}));
return plot({
  x: {label: "Month uploaded", tickRotate: -45},
  y: {label: "Files", grid: true},
  color: {legend: true},
  marginBottom: 60,
  marks: [
    Plot.barY(rows, Plot.groupX({y: "count", title: v => `${v[0].month}: ${v.length} files\n` + [...new Set(v.map(d => d.family))].slice(0, 8).join(", ") + (v.length > 8 ? ", …" : "")},
      {x: "month", fill: "collection", tip: true})),
    Plot.ruleY([0]),
  ],
});