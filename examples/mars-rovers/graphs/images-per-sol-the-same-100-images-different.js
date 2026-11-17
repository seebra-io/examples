// Each rover's newest 100 images by sol. The rate divides by the sols the
// window spans (gaps included), not by the sols that happen to have images.
const rows = [...(data[0] || []), ...(data[1] || [])];
const rovers = [...new Set(rows.map(d => d.rover))];
const summary = rovers.map(r => rows.find(d => d.rover === r));
return plot({
  marginLeft: 56,
  marginTop: 36,
  fy: {label: null},
  x: {label: "Sol (Mars day of the mission)", tickFormat: "d"},
  y: {label: "Images that sol (count)", grid: true},
  color: {domain: ["Perseverance", "Curiosity"], range: ["#f97316", "#38bdf8"], legend: true},
  marks: [
    // one bar per sol on a linear axis, so sols without images show as gaps
    Plot.rectY(rows, {x: "sol", interval: 1, y: "images", fill: "rover", fy: "rover", inset: 1,
      channels: {cameras: "cameras", "window: first sol": "first_sol"}, tip: true}),
    Plot.ruleY([0]),
    // the rate over the window, with its Poisson 95% interval
    Plot.ruleY(summary, {y: "per_sol", fy: "rover", stroke: "currentColor", strokeDasharray: "4,3"}),
    Plot.text(summary, {fy: "rover", frameAnchor: "top-left", dx: 6, dy: 4, lineAnchor: "top", fill: "currentColor",
      text: d => `${d.window_images} images over ${d.sols_spanned} sol${d.sols_spanned === 1 ? "" : "s"} (sols ${d.first_sol}–${d.last_sol}): ` +
        `${d.per_sol} per sol (95%: ${d.per_sol_lo}–${d.per_sol_hi}, dashed)\n` +
        `per sol with images: ${d.per_sol_with_images} (${d.sols_with_images} of ${d.sols_spanned} sols)`}),
  ],
  caption: "Caveats: the first sol is cut by the 100-image limit, the newest are still being downlinked, and images come in bursts, so the Poisson interval is too narrow.",
});