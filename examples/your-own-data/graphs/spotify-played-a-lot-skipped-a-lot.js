// How often each artist gets skipped (under 30 s or 'skipped' in the file)
// against how much you play them. Top right: played a lot, skipped a lot.
return plot({
  marginLeft: 50, grid: true,
  x: {label: "Hours listened →", type: "log"},
  y: {label: "↑ Skipped (%)", domain: [0, 60]},
  marks: [
    Plot.dot(data, {x: "hours", y: "skip_pct", r: d => Math.sqrt(d.tracks) * 2, fill: "currentColor", fillOpacity: 0.3, stroke: "currentColor",
                    tip: true, channels: {Artist: "artist", Plays: "plays", "First played": "first_played"}}),
    Plot.text(data, {x: "hours", y: "skip_pct", text: "artist", dy: -12, fontSize: 11})
  ]
});