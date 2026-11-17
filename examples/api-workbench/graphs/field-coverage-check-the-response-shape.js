// How many records have each field (non-null), from the Users step. A field
// below 100% is optional in the API or a mapping that missed: check the path
// in the Users step before trusting a join or a group on it.
const row = data[0] || {};
const n = row.records || 0;
const fields = Object.entries(row).filter(([k]) => k !== "records").map(([field, have]) => ({field, have, pct: n ? 100 * have / n : 0}));
return plot({
  marginLeft: 80,
  height: Math.max(180, fit?.height ?? 260),
  x: {label: `Records with the field (% of ${n})`, domain: [0, 100], grid: true},
  y: {label: null},
  color: {legend: false},
  marks: [
    Plot.barX(fields, {y: "field", x: "pct", fill: d => d.pct === 100 ? "#22c55e" : "#eab308",
      title: d => `${d.field}: ${d.have} of ${n} records have it`, tip: true}),
    Plot.ruleX([0, 100]),
  ],
});