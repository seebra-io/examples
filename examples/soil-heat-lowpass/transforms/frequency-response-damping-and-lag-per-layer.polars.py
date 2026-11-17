# each layer against the air and against the top soil layer: the ground's frequency response at two frequencies
data.join(data.filter(col("k") == 0).select("cycle", air_amp = col("amplitude_c"), air_phase = col("phase_rad")), on="cycle")
    .join(data.filter(col("k") == 1).select("cycle", top_amp = col("amplitude_c"), top_phase = col("phase_rad")), on="cycle")
    .with_columns(ratio_vs_air = col("amplitude_c") / col("air_amp"),
                  ratio_vs_top = col("amplitude_c") / col("top_amp"),
                  # lags wrapped to 0 … 2π, then from radians to hours and to degrees of the cycle
                  lag_air_rad = ((col("phase_rad") - col("air_phase")) % 6.283185307179586 + 6.283185307179586) % 6.283185307179586,
                  lag_top_rad = ((col("phase_rad") - col("top_phase")) % 6.283185307179586 + 6.283185307179586) % 6.283185307179586,
                  dz_m = col("depth_m") - 0.035)
    .with_columns(lag_air_rad = when(col("lag_air_rad") > 5.5).then(col("lag_air_rad") - 6.283185307179586).otherwise(col("lag_air_rad")),
                  lag_top_rad = when(col("lag_top_rad") > 5.5).then(col("lag_top_rad") - 6.283185307179586).otherwise(col("lag_top_rad")))
    .with_columns(lag_air_h = col("lag_air_rad") * col("period_h") / 6.283185307179586,
                  lag_air_deg = col("lag_air_rad") * 57.29577951308232,
                  lag_top_deg = col("lag_top_rad") * 57.29577951308232,
                  # damping depth d of the heat equation, from the amplitude (A = A0·e^(−Δz/d)) and from the phase (φ = Δz/d)
                  d_amp_m = when((col("dz_m") > 0) & (col("ratio_vs_top") > 0.01)).then(-col("dz_m") / col("ratio_vs_top").log()).otherwise(lit(None)),
                  d_phase_m = when((col("dz_m") > 0) & (col("ratio_vs_top") > 0.01)).then(col("dz_m") / col("lag_top_rad")).otherwise(lit(None)),
                  log_ratio_top = when(col("ratio_vs_top") > 0.01).then(col("ratio_vs_top").log()).otherwise(lit(None)),
                  above_noise = col("ratio_vs_top") > 0.01,
                  # what one first-order (RC) stage could do at most: lag below 90°
                  beyond_one_rc = col("lag_air_rad") > 1.5707963267948966)
    .select("cycle", "layer", "depth_m", "dz_m", "period_h", "n", "above_noise", "beyond_one_rc", mean_c = col("mean_c").round(2), amplitude_c = col("amplitude_c").round(4),
            ratio_vs_air = col("ratio_vs_air").round(5), ratio_vs_top = col("ratio_vs_top").round(5),
            lag_air_h = col("lag_air_h").round(1), lag_air_days = (col("lag_air_h") / 24).round(1), lag_air_deg = col("lag_air_deg").round(1), lag_top_deg = col("lag_top_deg").round(1),
            log_ratio_top = col("log_ratio_top").round(4), lag_top_rad = col("lag_top_rad").round(4),
            d_amp_m = col("d_amp_m").round(3), d_phase_m = col("d_phase_m").round(3))
    .sort("cycle", "depth_m")