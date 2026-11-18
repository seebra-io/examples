// Reid et al. 2019's fit per arm: ln(R/R_kink) = -(beta - beta_kink) tan(psi).
(() => (((data && data.arms) || []).map(a => ({arm: a.name, beta_from: a.beta_min, beta_to: a.beta_max, beta_kink: a.beta_kink, R_kink_kpc: a.R_kink,
  pitch_inside: a.psi_lt, pitch_outside: a.psi_gt, width_kpc: a.width_kpc, note: a.note}))))()