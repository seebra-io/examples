// The black-hole mass spectrum: how many mergers have their heavier mass in
// each band (log-spaced bins). It is not one smooth slope: a pile near 10
// Suns, a second bump near 35 (the "35-solar-mass peak" stellar models link to the
// edge of pair instability), then a thinning tail that runs right through
// the gap where no black hole from a single star should be. Heavy ones
// there may be second-generation: the remnants of earlier mergers in dense
// star clusters. Caveat: these are detected counts; heavy mergers are
// louder and seen further, so the true population has relatively more
// light ones.
const s = data || {};
const ev = (s.events || []).filter((e) => e.m1 != null);
const g = s.gaps || {lower: [2.5, 5], pair_instability: [60, 130]};
return plot({
  height: Math.max(380, (fit?.height ?? 520) - 30), marginLeft: 50,
  x: {type: "log", domain: [1, 200], label: "heavier mass m₁ (solar masses, log) →", ticks: [1, 2, 5, 10, 20, 35, 60, 100, 130, 200], tickFormat: String},
  y: {label: "↑ mergers", grid: true},
  color: {domain: ["two black holes", "neutron star + black hole", "two neutron stars"], range: ["#60a5fa", "#f59e0b", "#ef4444"], legend: true},
  marks: [
    Plot.rect([{x1: g.lower[0], x2: g.lower[1]}, {x1: g.pair_instability[0], x2: g.pair_instability[1]}], {x1: "x1", x2: "x2", fill: (d, i) => ["#f59e0b", "#a78bfa"][i], fillOpacity: 0.1}),
    Plot.rectY(ev, Plot.binX({y: "count"}, {x: {value: "m1", thresholds: d3.range(0, 2.31, 0.06).map((k) => 10 ** k)}, fill: "kind", tip: true})),
    Plot.ruleY([0]),
    Plot.text([{x: 88, t: `pair-instability gap: ${s.summary?.pi_gap.length} mergers with a mass in it`}], {x: "x", frameAnchor: "top", text: "t", dy: 8, fill: "#a78bfa", fontWeight: 600, fontSize: 11}),
  ],
  caption: `Median heavier mass ${s.summary?.median_m1?.toFixed(0)} solar masses. Gap edges are approximate (theory puts the pair-instability gap's lower edge anywhere from about 45 to 70 solar masses).`,
});