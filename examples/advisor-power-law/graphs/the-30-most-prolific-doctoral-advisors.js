// The 30 advisors with the most doctoral students in Wikidata: the tail, by name.
// data: top {rank, advisor, students, times_mean, share_pct, link}
const rows = Array.isArray(data) ? data : [];
return plot({
  height: Math.max(460, rows.length * 16 + 60),
  marginLeft: 190,
  x: {label: "doctoral students recorded in Wikidata (P184) →", grid: true},
  y: {label: null, domain: rows.map(d => d.advisor)},
  marks: [
    Plot.barX(rows, {y: "advisor", x: "students", fill: "#2563eb", fillOpacity: 0.8, href: "link", target: "_blank", tip: true,
      channels: {rank: "rank", "× the mean advisor": "times_mean", "% of all recorded supervisions": "share_pct"}}),
    Plot.ruleX([0]),
  ],
  caption: `The far tail of the distribution, one bar per person; click a bar for the advisor on Wikidata. The top advisor has ${rows[0]?.students} students, ${rows[0]?.times_mean}× the mean. `
    + `Awareness: these counts are what Wikidata's editors entered; whole lineages imported from one source (one university, the Mathematics Genealogy Project) can inflate a few advisors, and many real supervisions are missing.`,
});