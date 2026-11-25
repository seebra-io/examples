// Fits a flat universe of matter and dark energy to three rulers, on a grid:
// - BAO: DESI DR2's distances in units of the sound horizon r_d (DM/r_d,
//   DH/r_d, DV/r_d at seven redshifts, with their covariance);
// - supernovae: Pantheon+'s 1,701 type Ia magnitudes (corrected m_B),
//   whose absolute brightness is left free, so only their shape counts;
// - the CMB: Planck's acoustic angle θ*, as one more distance to z = 1090.
// Dark energy's equation of state w(z) = w0 + wa·z/(1+z) (CPL); ΛCDM is
// w0 = −1, wa = 0. For every Ωm, w0, wa on the grid the χ² of each ruler,
// the scale c/(H0·r_d) fitted analytically; then the best fits, the
// profile χ²(w0, wa) per combination, curves and residuals to draw.
// data[0]: Pantheon+SH0ES.dat (text); data[1]: DESI means; data[2]: DESI
// covariance.
(() => {
  const [snText, baoText, covText] = data;
  const C = 299792.458, OR = 9.1e-5;        // km/s; radiation (photons + massless ν at h ≈ 0.68)
  const RD_PLANCK = 147.09, H0_PLANCK = 67.36, H0_PLANCK_ERR = 0.54; // Planck 2018 (TT,TE,EE+lowE+lensing)
  const ZSTAR = 1089.92, CMB = 144.39 / 147.09 / 0.0104110, CMB_ERR = 0.003; // DM(z*)/r_d = (r*/r_d)/θ*; 0.3% for this board's approximations
  const lines = (t) => String(t || "").trim().split(/\r?\n/).filter((l) => l && !l.startsWith("#"));

  // DESI
  const bao = lines(baoText).map((l) => { const [z, v, q] = l.trim().split(/\s+/); return {z: +z, value: +v, quantity: q}; });
  const cov = lines(covText).map((l) => l.trim().split(/\s+/).map(Number));
  const inv = (M) => { // Gauss–Jordan
    const n = M.length, A = M.map((r, i) => [...r, ...Array.from({length: n}, (_, j) => +(i === j))]);
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]];
      const d = A[c][c]; for (let j = 0; j < 2 * n; j++) A[c][j] /= d;
      for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c]; if (f) for (let j = 0; j < 2 * n; j++) A[r][j] -= f * A[c][j]; }
    }
    return A.map((r) => r.slice(n));
  };
  const Ci = inv(cov);
  bao.forEach((b, i) => b.error = Math.sqrt(cov[i][i]));

  // Pantheon+: the Hubble-flow sample (z > 0.01, not a Cepheid host), binned in log z
  const sl = lines(snText), head = sl.shift().split(/\s+/);
  const col = Object.fromEntries(head.map((h, i) => [h, i]));
  const sn = sl.map((l) => l.trim().split(/\s+/)).map((r) => ({
    id: r[col.CID], z: +r[col.zHD], zhel: +r[col.zHEL], m: +r[col.m_b_corr], err: +r[col.MU_SH0ES_ERR_DIAG] || +r[col.m_b_corr_err_DIAG],
    mu_sh0es: +r[col.MU_SH0ES], calibrator: r[col.IS_CALIBRATOR] === "1", ceph: +r[col.CEPH_DIST]}));
  const flow = sn.filter((s) => !s.calibrator && s.z > 0.01);
  const NB = 36, lz0 = Math.log(0.01), lz1 = Math.log(2.3);
  const bins = Array.from({length: NB}, () => ({w: 0, wz: 0, wm: 0, wzh: 0, n: 0}));
  for (const s of flow) {
    const k = Math.min(NB - 1, Math.max(0, Math.floor((Math.log(s.z) - lz0) / (lz1 - lz0) * NB)));
    const w = 1 / (s.err * s.err), b = bins[k];
    b.w += w; b.wz += w * s.z; b.wzh += w * s.zhel; b.wm += w * s.m; b.n++;
  }
  const snb = bins.filter((b) => b.n).map((b) => ({z: b.wz / b.w, zhel: b.wzh / b.w, m: b.wm / b.w, err: Math.sqrt(1 / b.w), n: b.n}));

  // distances for one model: ∫ dz/E on a grid in x = ln(1+z), to z = 2.7 finely and on to z*
  const X1 = Math.log(3.7), XS = Math.log(1 + ZSTAR), N1 = 220, N2 = 140;
  const xs = [...Array.from({length: N1 + 1}, (_, i) => X1 * i / N1), ...Array.from({length: N2}, (_, i) => X1 + (XS - X1) * (i + 1) / N2)];
  const zs = xs.map((x) => Math.expm1(x));
  const E = (z, om, w0, wa) => {
    const a = 1 + z, ode = 1 - om - OR;
    return Math.sqrt(om * a * a * a + OR * a * a * a * a + ode * Math.pow(a, 3 * (1 + w0 + wa)) * Math.exp(-3 * wa * z / a));
  };
  const model = (om, w0, wa) => {
    const I = new Float64Array(xs.length); let prev = 1 / E(0, om, w0, wa);
    for (let i = 1; i < xs.length; i++) {
      const f = (1 + zs[i]) / E(zs[i], om, w0, wa);
      I[i] = I[i - 1] + 0.5 * (f + prev) * (xs[i] - xs[i - 1]); prev = f;
    }
    const dm = (z) => { // interpolate in x
      const x = Math.log1p(z);
      if (x <= X1) { const t = x / X1 * N1, i = Math.min(N1 - 1, Math.floor(t)); return I[i] + (I[i + 1] - I[i]) * (t - i); }
      return I[xs.length - 1];
    };
    return {dm, dh: (z) => 1 / E(z, om, w0, wa), dmStar: I[xs.length - 1]};
  };
  // chi² of each ruler; the overall scale A = c/(H0 r_d) (BAO, CMB) and the SN magnitude offset analytic
  const fitParts = (om, w0, wa) => {
    const m = model(om, w0, wa);
    const g = bao.map((b) => b.quantity === "DM_over_rs" ? m.dm(b.z) : b.quantity === "DH_over_rs" ? m.dh(b.z) : Math.cbrt(b.z * m.dm(b.z) ** 2 * m.dh(b.z)));
    let gg = 0, gd = 0, dd = 0;
    for (let i = 0; i < g.length; i++) for (let j = 0; j < g.length; j++) { gg += g[i] * Ci[i][j] * g[j]; gd += g[i] * Ci[i][j] * bao[j].value; dd += bao[i].value * Ci[i][j] * bao[j].value; }
    const Abao = gd / gg, chiBao = dd - gd * gd / gg;
    const wc = 1 / (CMB * CMB_ERR) ** 2;
    const ggc = gg + m.dmStar * m.dmStar * wc, gdc = gd + m.dmStar * CMB * wc, ddc = dd + CMB * CMB * wc;
    const Acmb = gdc / ggc, chiBaoCmb = ddc - gdc * gdc / ggc;
    let sw = 0, sr = 0, srr = 0;
    for (const b of snb) { const r = b.m - 5 * Math.log10((1 + b.zhel) * m.dm(b.z)), w = 1 / (b.err * b.err); sw += w; sr += w * r; srr += w * r * r; }
    const chiSn = srr - sr * sr / sw, offset = sr / sw;
    return {m, chiBao, Abao, chiBaoCmb, Acmb, chiSn, offset};
  };

  // the grid (w0 + wa < 0: dark energy must not dominate the early universe)
  const OMS = d3range(0.22, 0.42, 0.01), W0S = d3range(-1.5, -0.3, 0.03), WAS = d3range(-3.0, 1.2, 0.08);
  function d3range(a, b, s) { const r = []; for (let v = a; v <= b + 1e-9; v += s) r.push(+v.toFixed(4)); return r; }
  const COMBOS = ["BAO", "SN", "BAO+CMB", "BAO+CMB+SN"];
  const chiOf = (p, k) => k === "BAO" ? p.chiBao : k === "SN" ? p.chiSn : k === "BAO+CMB" ? p.chiBaoCmb : p.chiBaoCmb + p.chiSn;
  const profile = {}; COMBOS.forEach((k) => profile[k] = new Map());
  const best = {}; COMBOS.forEach((k) => best[k] = {chi: Infinity});
  const lcdm = {}; COMBOS.forEach((k) => lcdm[k] = {chi: Infinity});
  const consider = (om, w0, wa) => {
    const p = fitParts(om, w0, wa);
    for (const k of COMBOS) {
      const c = chiOf(p, k), key = `${w0},${wa}`;
      const cur = profile[k].get(key);
      if (cur == null || c < cur) profile[k].set(key, c);
      if (c < best[k].chi) best[k] = {chi: c, om, w0, wa, A: k === "BAO" ? p.Abao : p.Acmb};
      if (w0 === -1 && wa === 0 && c < lcdm[k].chi) lcdm[k] = {chi: c, om, w0, wa, A: k === "BAO" ? p.Abao : p.Acmb, offset: p.offset};
    }
  };
  for (const om of OMS) {
    consider(om, -1, 0);
    for (const w0 of W0S) for (const wa of WAS) if (w0 + wa < -0.05) consider(om, w0, wa);
  }
  // Δχ² of ΛCDM against the best (w0, wa), as a Gaussian σ for 2 parameters
  const sigma = (d) => { // p = exp(−Δχ²/2) for 2 dof; σ with the same two-sided p
    const p = Math.exp(-Math.max(0, d) / 2);
    let lo = 0, hi = 10; // bisection on erfc(s/√2) = p
    const erfc = (x) => { const t = 1 / (1 + 0.5 * x), y = t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return y; };
    for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (erfc(mid / Math.SQRT2) > p) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  const verdict = COMBOS.map((k) => ({combination: k, lcdm_chi2: lcdm[k].chi, best_chi2: best[k].chi, delta_chi2: lcdm[k].chi - best[k].chi,
    sigma: sigma(lcdm[k].chi - best[k].chi), om_lcdm: lcdm[k].om, w0: best[k].w0, wa: best[k].wa, om: best[k].om,
    h0_rd: k === "SN" ? null : C / best[k].A, h0_lcdm: k === "SN" ? null : C / lcdm[k].A / RD_PLANCK}));
  const contours = COMBOS.map((k) => {
    const mn = best[k].chi;
    return {combination: k, cells: [...profile[k]].map(([key, c]) => { const [w0, wa] = key.split(",").map(Number); return {w0, wa, d: c - mn}; }).filter((c) => c.d < 12)};
  });

  // curves: ΛCDM (BAO+CMB best) and the w0wa best fit of all, both on the same r_d scale
  const L = lcdm["BAO+CMB"], Wb = best["BAO+CMB+SN"];
  const mL = model(L.om, -1, 0), mW = model(Wb.om, Wb.w0, Wb.wa);
  const curve = [];
  for (let z = 0.05; z <= 2.6; z += 0.025) {
    const q = (m, A) => ({dm: A * m.dm(z), dh: A * m.dh(z), dv: A * Math.cbrt(z * m.dm(z) ** 2 * m.dh(z))});
    const a = q(mL, L.A), b = q(mW, Wb.A);
    curve.push({z, lcdm_dm: a.dm, lcdm_dh: a.dh, lcdm_dv: a.dv, w_dm: b.dm, w_dh: b.dh, w_dv: b.dv,
                w_of_z: Wb.w0 + Wb.wa * z / (1 + z)});
  }
  const points = bao.map((b) => {
    const ref = b.quantity === "DM_over_rs" ? L.A * mL.dm(b.z) : b.quantity === "DH_over_rs" ? L.A * mL.dh(b.z) : L.A * Math.cbrt(b.z * mL.dm(b.z) ** 2 * mL.dh(b.z));
    return {...b, quantity: b.quantity.replace("_over_rs", "/r_d"), lcdm: ref, ratio: b.value / ref, ratio_err: b.error / ref};
  });
  // supernova residuals against ΛCDM (all rulers' Ωm), and the w0wa curve's difference
  const all = fitParts(lcdm["BAO+CMB+SN"].om, -1, 0), allW = fitParts(Wb.om, Wb.w0, Wb.wa);
  const resid = (s) => s.m - 5 * Math.log10((1 + s.zhel) * all.m.dm(s.z)) - all.offset;
  const sn_points = flow.map((s) => ({id: s.id, z: s.z, residual: resid(s), err: s.err}));
  const sn_bins = snb.map((b) => ({z: b.z, residual: resid(b), err: b.err, n: b.n}));
  const sn_curve = curve.map((c) => ({z: c.z, residual: (5 * Math.log10(allW.m.dm(c.z)) + allW.offset) - (5 * Math.log10(all.m.dm(c.z)) + all.offset)}));

  // the Hubble constant three ways
  const ladder = sn.filter((s) => !s.calibrator && s.z > 0.023 && s.z < 0.15).map((s) => {
    const m = mL; const dl = (1 + s.zhel) * (C / 100) * m.dm(s.z); // Mpc for H0 = 100
    return {id: s.id, z: s.z, h0: 100 * dl / Math.pow(10, (s.mu_sh0es - 25) / 5), err: s.err};
  });
  let w = 0, wl = 0; for (const s of ladder) { const wi = 1 / (s.err * s.err); w += wi; wl += wi * Math.log(s.h0); }
  const h0Ladder = Math.exp(wl / w), h0LadderErr = h0Ladder * Math.log(10) / 5 * Math.sqrt(1 / w);
  const calibrators = sn.filter((s) => s.calibrator).map((s) => ({id: s.id, z: s.z, mu_cepheid: s.ceph, mu_sn: s.mu_sh0es}));
  return {
    counts: {bao: bao.length, supernovae: sn.length, hubble_flow: flow.length, sn_bins: snb.length, calibrators: calibrators.length, models: OMS.length * (1 + W0S.length * WAS.length)},
    verdict, contours, points, curve, sn_points, sn_bins, sn_curve,
    best: {w0: Wb.w0, wa: Wb.wa, om: Wb.om}, lcdm_om: L.om,
    h0: [
      {method: "Distance ladder: Cepheids → supernovae (Pantheon+SH0ES, 0.023 < z < 0.15)", h0: h0Ladder, err: h0LadderErr, n: ladder.length, note: "statistical only, diagonal errors; SH0ES: 73.0 ± 1.0"},
      {method: "BAO + CMB θ* with Planck's sound horizon (r_d = 147.09 Mpc)", h0: C / L.A / RD_PLANCK, err: null, note: "ΛCDM; r_d from early-universe physics"},
      {method: "Planck 2018 CMB, ΛCDM (published)", h0: H0_PLANCK, err: H0_PLANCK_ERR, note: "Planck Collaboration 2020, A&A 641 A6"},
    ],
    ladder, calibrators,
  };
})()