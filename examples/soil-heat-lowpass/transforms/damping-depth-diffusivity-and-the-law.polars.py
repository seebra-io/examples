# per cycle: the damping depth fitted through the layers above the noise (least squares through the top layer),
# from the amplitudes and from the lags, the soil's thermal diffusivity κ = ω·d²/2, and the √ω law of diffusion
data.filter((col("dz_m") > 0) & col("above_noise"))
    .group_by("cycle")
    .agg(layers = len(), period_h = col("period_h").first(),
         szy = (col("dz_m") * col("log_ratio_top")).sum(), szz = (col("dz_m") * col("dz_m")).sum(),
         szp = (col("dz_m") * col("lag_top_rad")).sum())
    .with_columns(d_amp_m = -col("szz") / col("szy"), d_phase_m = col("szz") / col("szp"),
                  omega_rad_s = 6.283185307179586 / (col("period_h") * 3600))
    .with_columns(kappa_amp_mm2_s = (col("omega_rad_s") * col("d_amp_m").pow(2) / 2 * 1000000).round(3),
                  kappa_phase_mm2_s = (col("omega_rad_s") * col("d_phase_m").pow(2) / 2 * 1000000).round(3))
    .with_columns(ratio_amp = col("d_amp_m") / col("d_amp_m").min(),
                  ratio_phase = col("d_phase_m") / col("d_phase_m").min(),
                  sqrt_law = (col("period_h") / col("period_h").min()).sqrt())
    .select("cycle", "period_h", "layers", "kappa_amp_mm2_s", "kappa_phase_mm2_s",
            d_amp_m = col("d_amp_m").round(3), d_phase_m = col("d_phase_m").round(3),
            annual_over_daily_amp = col("ratio_amp").round(2), annual_over_daily_phase = col("ratio_phase").round(2), sqrt_omega_law = col("sqrt_law").round(2))
    .sort("period_h")