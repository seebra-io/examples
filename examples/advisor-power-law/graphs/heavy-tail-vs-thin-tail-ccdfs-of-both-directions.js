// The degree distribution as a CCDF, P(K ≥ k), on log-log axes, for both directions of the doctoral-advisor network.
// data: curves {network, k, n, ccdf, ccdf_tail, ccdf_all, ccdf_geo, expected_geo, observed_at_least, xmin, alpha, alpha_1, link}
const rows = Array.isArray(data) ? data : [];
const adv = rows.filter(d => d.network === "students per advisor");
const first = adv[0] || {};
const lines = [
  ...adv.filter(d => d.ccdf_tail != null).map(d => ({k: d.k, y: d.ccdf_tail, model: `power law, tail k ≥ ${d.xmin} (α = ${d.alpha})`})),
  ...adv.filter(d => d.ccdf_all != null).map(d => ({k: d.k, y: d.ccdf_all, model: `power law, all k (α = ${d.alpha_1})`})),
  ...rows.filter(d => d.ccdf_geo > 1e-7).map(d => ({k: d.k, y: d.ccdf_geo, model: `geometric, same mean (${d.network})`})),
];
return plot({
  height: Math.max(420, (fit?.height ?? 520) - 40),
  x: {type: "log", label: "k: doctoral students per advisor, or advisors per student (log scale) →", grid: true},
  y: {type: "log", label: "↑ P(K ≥ k): share with k or more (log scale)", grid: true, domain: [1e-6, 1]},
  color: {legend: true, domain: ["students per advisor", "advisors per student"], range: ["#2563eb", "#f97316"]},
  marks: [
    Plot.line(lines, {x: "k", y: "y", z: "model", stroke: "model", strokeDasharray: d => d.model.startsWith("geometric") ? "2,3" : d.model.includes("all k") ? "6,3" : null,
      strokeWidth: 1.5, tip: true, channels: {model: "model", "k": "k", "P(K ≥ k)": "y"}}),
    Plot.dot(rows, {x: "k", y: "ccdf", fill: "network", r: 3, href: "link", target: "_blank", tip: true,
      channels: {network: "network", "people with exactly k": "n", "people with k or more": "observed_at_least",
                 "a same-mean geometric expects": d => d.expected_geo < 0.01 ? d.expected_geo.toExponential(1) : d.expected_geo.toFixed(1)}}),
  ],
  caption: `Each dot: the share of advisors (blue) with at least k doctoral students in Wikidata, or of students (orange) with at least k advisors; click a dot for the people at that k in the Wikidata Query Service. `
    + `Notice that the blue curve falls slowly over two decades of k while the orange one plunges like its geometric reference (dotted): a geometric with the advisors' own mean would expect essentially nobody with 50 students, yet hundreds have. `
    + `The two power-law lines differ (α = ${first.alpha_1} from k ≥ 1, α = ${first.alpha} from k ≥ ${first.xmin}): the curve bends, so "the" exponent depends on where the tail is said to start (next chart). Caveat: these are the supervisions Wikidata records (P184), not all that happened.`,
});