// The newest 100 images of each rover, per camera. Hover a bar for the
// count and the sols; a camera missing for one rover is one it doesn't carry
// or didn't use in this window.
const rows = [...(data[0] || []), ...(data[1] || [])];
return plot({
  marginLeft: 130,
  x: {label: "Images among each rover's newest 100 (count)", grid: true},
  y: {label: null},
  color: {domain: ["Perseverance", "Curiosity"], range: ["#f97316", "#38bdf8"], legend: true},
  marks: [
    Plot.barX(rows, Plot.groupY({x: "count", title: v => `${v[0].rover} · ${v[0].camera}: ${v.length} images, sols ${d3.min(v, d => d.sol)}–${d3.max(v, d => d.sol)}`},
      {y: "camera", fill: "rover", sort: {y: "-x"}, tip: true})),
    Plot.ruleX([0]),
  ],
});