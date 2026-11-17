// Does reconstruction reset the clock? data: clocks {band, age_mid, never_rating, since_rebuilt_rating, rebuilt_since_built_rating, *_bridges}
const rows = Array.isArray(data) ? data : [];
const series = [
  ["never reconstructed: years since built", "never_rating", "never_bridges"],
  ["reconstructed: years since reconstruction", "since_rebuilt_rating", "since_rebuilt_bridges"],
  ["reconstructed: years since first built", "rebuilt_since_built_rating", "rebuilt_since_built_bridges"]];
const long = rows.flatMap(d => series.map(([clock, r, n]) => ({clock, age: d.age_mid, band: d.band, rating: d[r], bridges: d[n]})))
  .filter(d => d.rating != null && d.bridges >= 50);
return plot({
  height: Math.max(360, (fit?.height ?? 440) - 40),
  x: {label: "years on the clock (10-year bands) →", grid: true},
  y: {label: "↑ mean lowest condition rating (0–9)", grid: true},
  color: {legend: true, domain: series.map(s => s[0]), range: ["#2563eb", "#f97316", "#a1a1aa"]},
  marks: [
    Plot.line(long, {x: "age", y: "rating", stroke: "clock", strokeWidth: 2}),
    Plot.dot(long, {x: "age", y: "rating", fill: "clock", r: 3, tip: true,
      channels: {clock: "clock", years: d => `${d.band}–${d.band + 9}`, bridges: "bridges", "mean rating": "rating"}}),
  ],
  caption: "Reconstruction (NBI item 106) resets the clock only partly: a bridge rebuilt within the last 10 years averages about 6.45, a never-reconstructed one of 0–9 years 7.6. "
    + "Reconstructed bridges then age along the orange curve, about a point below new ones at the same years since work; by age since first built (grey) they rate above never-reconstructed bridges of the same age from about 30 years on (rebuilding is what keeps old bridges in service). "
    + "Caveat: item 106 is the latest reconstruction only, and what counts as reconstruction varies by state.",
});
