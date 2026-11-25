// The paper's numbers next to today's PBDB, so the reader sees what changed.
// Paper: Benson et al. 2016, PLOS Biology 14(1): e1002359 (Methods, Results,
// Fig 5). Live: this board's steps.
(() => {
  const [claim, trend, bins] = data;
  const occs = bins.reduce((t, d) => t + (d.occurrences || 0), 0);
  const fit = (m, f) => trend.find((t) => t.measure === m && t.fit === f) || {};
  // least squares: ln(SQS genera) on time (Myr after the start of the Triassic)
  const xs = claim.map((d) => d.myr), ys = claim.map((d) => d.ln_sqs_genera);
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  const b = sxy / sxx;
  let rss = 0;
  for (let i = 0; i < n; i++) rss += (ys[i] - my - b * (xs[i] - mx)) ** 2;
  const se = Math.sqrt(rss / (n - 2) / sxx);
  const r5 = (v) => Math.round(v * 1e5) / 1e5;
  const p = (v) => v == null ? "?" : v < 0.001 ? "< 0.001" : v.toFixed(3);
  const g = fit("genera", "all Mesozoic bins"), g1 = fit("genera", "without Tr1");
  const s = fit("species", "all Mesozoic bins"), s1 = fit("species", "without Tr1");
  return [
    { what: "Data", paper: "27,260 occurrences of 4,898 species in 3,323 genera (PBDB via Fossilworks, 22 January 2015)",
      live: `PBDB today: ${occs.toLocaleString("en")} occurrences over ${bins.length} bins (Triassic to Paleocene); ${n} Mesozoic bins reach the SQS quorum`,
      note: "The PBDB has grown since 2015, and the paper also removed some marine and trace taxa by name." },
    { what: "Genus counts on age, all Mesozoic bins (Fig 1B)", paper: "no significant trend (only without Tr1)",
      live: `ln(count) ${g.slope_per_myr} per Myr of age, p ${p(g.p)}${g.significant ? ": significant" : ": not significant"}`,
      note: "Poisson GLM, SE widened for overdispersion (the paper: negative binomial, Table 1)." },
    { what: "Genus counts on age, without Tr1", paper: "significant trend",
      live: `${g1.slope_per_myr} per Myr, p ${p(g1.p)}${g1.significant ? ": significant" : ": not significant"}`, note: "" },
    { what: "Species counts on age, all Mesozoic bins (Fig 1C)", paper: "no significant trend (only without Tr1)",
      live: `${s.slope_per_myr} per Myr, p ${p(s.p)}${s.significant ? ": significant" : ": not significant"}`, note: "" },
    { what: "Species counts on age, without Tr1", paper: "significant trend",
      live: `${s1.slope_per_myr} per Myr, p ${p(s1.p)}${s1.significant ? ": significant" : ": not significant"}`, note: "" },
    { what: "Net diversification after subsampling (Fig 5A)", paper: "0.00335 ln(species) per Myr (±2 SE: 0.00089 to 0.00581), regional species, quorum 0.4",
      live: `${r5(b)} ln(genera) per Myr (±2 SE: ${r5(b - 2 * se)} to ${r5(b + 2 * se)}), global genera, quorum 0.4`,
      note: "Not the same measure: the paper subsamples species within continental regions; this board, genera worldwide. Compare the size, not the digits." },
    { what: "Change over the Mesozoic implied", paper: "species diversity less than doubled",
      live: `×${(Math.exp(b * (252 - 66))).toFixed(2)} over 186 Myr (subsampled genera)`, note: "exp(slope × 186 Myr)." }
  ];
})()