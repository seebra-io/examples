// The paper's dashed lines (Fig 1): a generalised linear model of the taxon
// count per Mesozoic bin on its age (Ma), Poisson with a log link, fitted by
// iteratively reweighted least squares. Fitted to every Mesozoic bin and
// again without Tr1, the first Triassic bin (the paper: "statistically
// significant trends in genus and species counts are only supported if the
// first Triassic time bin (Tr1) ... is excluded").
// The paper's Table 1 uses a negative binomial model; here the Poisson
// standard error is widened by the overdispersion (quasi-Poisson), which
// gives about the same answer.
// slope: change in ln(count) per Myr of age; net_rate = -slope, per Myr
// forward in time (positive: diversity grows toward the present).
(() => {
  const erf = (x) => {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return x >= 0 ? y : -y;
  };
  const pTwo = (z) => 2 * (1 - 0.5 * (1 + erf(Math.abs(z) / Math.SQRT2)));
  function poisson(xs, ys) {
    // centre x for a stable fit
    const xm = xs.reduce((a, b) => a + b, 0) / xs.length;
    const x = xs.map((v) => v - xm);
    let a = Math.log(ys.reduce((s, v) => s + v, 0) / ys.length), b = 0;
    for (let it = 0; it < 50; it++) {
      let sw = 0, swx = 0, swxx = 0, swz = 0, swxz = 0;
      for (let i = 0; i < x.length; i++) {
        const mu = Math.exp(a + b * x[i]);
        const z = a + b * x[i] + (ys[i] - mu) / mu;
        sw += mu; swx += mu * x[i]; swxx += mu * x[i] * x[i]; swz += mu * z; swxz += mu * x[i] * z;
      }
      const det = sw * swxx - swx * swx;
      const na = (swxx * swz - swx * swxz) / det, nb = (sw * swxz - swx * swz) / det;
      const done = Math.abs(na - a) + Math.abs(nb - b) < 1e-10;
      a = na; b = nb;
      if (done) break;
    }
    let sw = 0, swx = 0, swxx = 0, chi2 = 0;
    for (let i = 0; i < x.length; i++) {
      const mu = Math.exp(a + b * x[i]);
      sw += mu; swx += mu * x[i]; swxx += mu * x[i] * x[i];
      chi2 += (ys[i] - mu) ** 2 / mu;
    }
    const varB = sw / (sw * swxx - swx * swx);
    const phi = Math.max(1, chi2 / Math.max(1, x.length - 2));
    const se = Math.sqrt(varB * phi);
    return { a: a - b * xm, b, se, phi, z: b / se, p: pTwo(b / se) };
  }
  const meso = data.filter((d) => d.mesozoic && d.genera > 0);
  const out = [];
  for (const measure of ["genera", "species"]) {
    for (const fit of ["all Mesozoic bins", "without Tr1"]) {
      const rows = meso.filter((d) => d[measure] > 0 && (fit === "all Mesozoic bins" || d.bin !== "Tr1"));
      if (rows.length < 3) continue;
      const m = poisson(rows.map((d) => d.mid_ma), rows.map((d) => d[measure]));
      const r = (v, n) => Math.round(v * 10 ** n) / 10 ** n;
      out.push({
        measure, fit, bins: rows.length,
        slope_per_myr: r(m.b, 5), se: r(m.se, 5), z: r(m.z, 2), p: r(m.p, 4),
        net_rate_per_myr: r(-m.b, 5),
        dispersion: r(m.phi, 2),
        significant: m.p < 0.05,
        // the dashed line: the model at each bin it was fitted to
        line: rows.map((d) => ({ mid_ma: d.mid_ma, value: r(Math.exp(m.a + m.b * d.mid_ma), 1) }))
      });
    }
  }
  return out;
})()