// Uses of each image repository, split by version. The most common version is solid,
// the others lighter; mutable tags (latest, no tag) are red.
const images = Array.isArray(data?.[0]) ? data[0] : [];
const drift = Array.isArray(data?.[1]) ? data[1] : [];
const byRepo = new Map(drift.map(d => [d.repo, d]));
const repos = drift.filter(d => d.versions > 1 || d.uses > 1).slice(0, 25).map(d => d.repo);
const shown = repos.length ? repos : drift.slice(0, 25).map(d => d.repo);
const counts = d3.rollups(images.filter(i => shown.includes(i.repo)), v => v, i => i.repo, i => i.tag)
  .flatMap(([repo, tags]) => {
    const max = d3.max(tags, ([, v]) => v.length);
    return tags.map(([tag, v]) => ({repo, tag, uses: v.length, mutable: v[0].mutable,
      kind: v[0].mutable ? "mutable tag" : v.length === max ? "most common version" : "other version",
      who: v.map(i => `${i.namespace}/${i.deployment}`)}));
  });
const short = s => s.length > 44 ? "…" + s.slice(-43) : s;
const pct = d3.format(".0%");
return plot({
  height: Math.max(180, shown.length * 24 + 80),
  marginLeft: 280,
  x: {label: "uses (containers in deployment templates) →", grid: true, tickFormat: "d"},
  y: {label: null, domain: shown, tickFormat: short},
  color: {domain: ["most common version", "other version", "mutable tag"], range: ["#38bdf8", "#f97316", "#ef4444"], legend: true},
  marks: [
    Plot.barX(counts, {y: "repo", x: "uses", fill: "kind", stroke: "var(--background, white)", strokeWidth: 1, tip: true,
      title: d => { const r = byRepo.get(d.repo); return `${d.repo}:${d.tag}\nused by ${d.uses}: ${d.who.slice(0, 6).join(", ")}${d.who.length > 6 ? "…" : ""}\n` +
        `${r.versions} version${r.versions > 1 ? "s" : ""} of this image · ${pct(r.modal_share)} on the most common · diversity ${r.diversity.toFixed(2)}`; }}),
    Plot.ruleX([0]),
  ],
  caption: "Diversity (1 − Σp²) is the chance that two uses of an image picked at random run different versions. A sidecar or base image with several versions is usually a rollout that didn't reach every team. Image repositories used once with one version are left out.",
});