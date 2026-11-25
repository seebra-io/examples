// Would AlphaMissense have told the clinic? The reviewed ClinVar
// classifications (at least one star) of the changes one DNA letter can
// make, against AlphaMissense's score, which was trained without ClinVar's
// labels. The pathogenic pile at the right and the benign at the left
// barely overlap. Below: the variants of uncertain significance (VUS),
// where a prediction is most useful and least proven. Caveat: some
// classifications since 2023 may cite AlphaMissense; TP53's are also
// informed by functional assays.
const s = data || {};
const c = s.clinvar || {};
const groups = [["pathogenic", "pathogenic / likely pathogenic, reviewed"], ["benign", "benign / likely benign, reviewed"], ["uncertain", "uncertain significance"]];
const rows = (s.variants || []).filter((v) => v.clinvar === "uncertain" || ((v.clinvar === "pathogenic" || v.clinvar === "benign") && v.stars >= 1))
  .map((v) => ({...v, group: groups.find((g) => g[0] === v.clinvar)[1]}));
const col = Object.fromEntries(groups.map((g, i) => [g[1], ["#ef4444", "#3b82f6", "#a1a1aa"][i]]));
const H = Math.max(380, (fit?.height ?? 520) - 30);
const pct = (k, g) => { const t = g.lp + g.amb + g.lb; return t ? `${Math.round(100 * g[k] / t)}%` : "–"; };
return plot({
  height: H, marginLeft: 50,
  fy: {domain: groups.map((g) => g[1]), label: null, axis: null},
  x: {domain: [0, 1], label: "AlphaMissense pathogenicity →"},
  y: {label: "↑ changes", grid: true},
  color: {domain: Object.keys(col), range: Object.values(col), legend: true},
  marks: [
    Plot.rectY(rows, Plot.binX({y: "count"}, {fy: "group", x: "am", fill: "group", thresholds: 40, tip: true})),
    Plot.ruleX([0.34, 0.564], {stroke: "currentColor", strokeOpacity: 0.5, strokeDasharray: "4,3"}),
    Plot.text([
      {group: groups[0][1], t: `${c.pathogenic} changes: ${pct("lp", c.pathogenic_calls || {})} called likely pathogenic, ${pct("lb", c.pathogenic_calls || {})} likely benign`},
      {group: groups[1][1], t: `${c.benign} changes: ${pct("lb", c.benign_calls || {})} called likely benign, ${pct("lp", c.benign_calls || {})} likely pathogenic`},
      {group: groups[2][1], t: `${c.uncertain} changes: AlphaMissense would call ${pct("lp", c.uncertain_calls || {})} pathogenic, ${pct("lb", c.uncertain_calls || {})} benign`},
    ], {fy: "group", frameAnchor: "top-left", text: "t", dx: 6, dy: 6, fontSize: 11, fontWeight: 600}),
  ],
  caption: `Ranking pathogenic above benign: AUC ${c.auc?.toFixed(3) ?? "?"} (1 is perfect, 0.5 chance). Dashed: AlphaMissense's thresholds 0.34 and 0.564.`,
});