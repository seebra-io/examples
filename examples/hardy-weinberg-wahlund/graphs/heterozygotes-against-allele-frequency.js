// Hardy–Weinberg's parabola: the share of heterozygotes against the
// allele frequency p. In equilibrium every sample sits on 2p(1 − p) (the
// curve), whatever p is. Small dots: the 26 populations, five variants,
// coloured by super-population; they hug the curve. Large rings: pooled
// samples (a super-population, or ALL); they fall below it, most for the
// variants whose frequency differs most between populations (SLC24A5,
// LCT): the Wahlund effect. rs334 (HbS) in African populations sits above:
// more heterozygotes than expected, the sickle-cell balance.
// Hover a dot for its counts and test; click it for the variant in Ensembl.
const rows = (Array.isArray(data) ? data : []).filter(d => d.N > 0 && d.p > 0 && d.p < 1);
const pops = rows.filter(d => d.level === "population"), pooled = rows.filter(d => d.level !== "population");
const curve = d3.range(0, 1.0001, 0.01).map(p => ({p, h: 2 * p * (1 - p)}));
const sp = ["AFR", "AMR", "EAS", "EUR", "SAS"];
const ch = {variant: "rsid", gene: "gene", population: d => d.pop_name ? `${d.pop} ${d.pop_name}` : d.pop, N: "N",
  "AA / Aa / aa": d => `${d.n_ref_ref} / ${d.n_het} / ${d.n_alt_alt}`, "expected Aa": "e_het", "χ² (1 df)": "chi2", "p-value": "p_value", F: "F"};
return plot({
  height: Math.max(420, (fit?.height ?? 500) - 20),
  x: {label: "frequency p of the alternative allele →", domain: [0, 1], grid: true},
  y: {label: "↑ heterozygotes (share of the sample)", domain: [0, 0.62], tickFormat: "%", grid: true},
  color: {domain: sp, range: ["#f59e0b", "#ef4444", "#22c55e", "#3b82f6", "#a855f7"], legend: true, label: "super-population"},
  symbol: {legend: true},
  marks: [
    Plot.line(curve, {x: "p", y: "h", stroke: "currentColor", strokeOpacity: 0.5}),
    Plot.text([{p: 0.5, h: 0.5}], {x: "p", y: "h", text: () => "2p(1 − p): Hardy–Weinberg", dy: -8, fillOpacity: 0.7}),
    Plot.dot(pops, {x: "p", y: "het_obs", fill: "superpop", symbol: "gene", r: 3, fillOpacity: 0.75, href: "link", target: "_blank", tip: true, channels: ch}),
    Plot.dot(pooled, {x: "p", y: "het_obs", stroke: d => d.pop === "ALL" ? "currentColor" : d.superpop, r: 8, strokeWidth: 2, href: "link", target: "_blank", tip: true, channels: ch}),
    Plot.text(pooled.filter(d => d.F > 0.15), {x: "p", y: "het_obs", text: d => `${d.pop} ${d.gene}`, dy: 15, fontSize: 10}),
  ],
  caption: "Rings: pooled samples (ALL in black, super-populations in their colour). Below the curve = too few heterozygotes.",
});