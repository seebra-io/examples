data.with_columns(t_k = col("temp_c") + 273.15, below_ground = col("p_hpa") > col("surface_hpa"))
    .sort("latitude", "p_hpa", descending=[False, True])
    # the next level up in the same column
    .with_columns(p_up = col("p_hpa").shift(-1).over("latitude"), t_up = col("t_k").shift(-1).over("latitude"), z_up = col("z_m").shift(-1).over("latitude"))
    .filter(col("p_up").is_not_null())
    # hypsometric equation: Δz = (R_d / g₀) · T̄ · ln(p₁/p₂), R_d = 287.05 J/(kg K), g₀ = 9.80665 m/s² (geopotential metres)
    .with_columns(t_mean = (col("t_k") + col("t_up")) / 2, ln_ratio = (col("p_hpa") / col("p_up")).log())
    .with_columns(dz_model_m = col("z_up") - col("z_m"), dz_hypsometric_m = 287.05 / 9.80665 * col("t_mean") * col("ln_ratio"))
    .with_columns(error_m = col("dz_hypsometric_m") - col("dz_model_m"),
                  error_pct = 100 * (col("dz_hypsometric_m") - col("dz_model_m")) / col("dz_model_m"),
                  lapse_k_per_km = -1000 * (col("t_up") - col("t_k")) / (col("z_up") - col("z_m")),
                  scale_height_km = 287.05 * col("t_mean") / 9.80665 / 1000,
                  sound_m_s = (1.4 * 287.05 * col("t_mean")).sqrt(),
                  layer = concat_str([col("p_hpa").cast(Int64).cast(String), lit("–"), col("p_up").cast(Int64).cast(String), lit(" hPa")]))
    .with_columns(error_m = col("error_m").round(1), error_pct = col("error_pct").round(2), lapse_k_per_km = col("lapse_k_per_km").round(2),
                  scale_height_km = col("scale_height_km").round(2), sound_m_s = col("sound_m_s").round(1), dz_hypsometric_m = col("dz_hypsometric_m").round(1))