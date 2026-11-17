// The whole inventory as a distribution: for each 5-year age band, the share of bridges at each lowest condition rating (0-9).
// data: ratings {band, built, rating, n, share, at_or_below, condition}
const rows = (Array.isArray(data) ? data : []).filter(d => d.band <= 125);
const bands = [...new Set(rows.map(d => d.band))].sort((a, b) => a - b);
return plot({
  height: Math.max(380, (fit?.height ?? 460) - 40),
  marginBottom: 44,
  x: {label: "age in 2025 (years, 5-year bands) →", type: "band", domain: bands, tickFormat: d => d % 10 === 0 ? d : ""},
  y: {label: "↑ share of the band's bridges", tickFormat: "%", domain: [0, 1]},
  color: {type: "ordinal", domain: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], scheme: "RdYlGn", reverse: true, legend: true,
          label: "lowest NBI condition rating (deck, superstructure, substructure or culvert): 9 excellent … 4 poor … 0 failed"},
  marks: [
    Plot.barY(rows, {x: "band", y: "share", fill: "rating", order: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], tip: true,
      channels: {built: "built", rating: "rating", class: "condition", bridges: "n", "share of the band": d => (100 * d.share).toFixed(1) + "%",
                 "share rated this or lower": d => (100 * d.at_or_below).toFixed(1) + "%"}}),
    Plot.ruleY([0.5], {stroke: "currentColor", strokeDasharray: "4,3", strokeOpacity: 0.6}),
  ],
  caption: "Read across the 50% line: new bridges are 8-9, half have dropped below 8 within 5-9 years, below 7 by 35-39 years, below 6 only at 95-99. "
    + "The steps get longer with age: this is a cross-section of the 2025 inventory, not one bridge's life, and the worst old bridges have already been replaced or rebuilt (survivor bias). "
    + "Hover a segment for its bridges and the cumulative share. Ratings: FHWA Coding Guide items 58-62 (https://doi.org/10.21949/1519105).",
});
