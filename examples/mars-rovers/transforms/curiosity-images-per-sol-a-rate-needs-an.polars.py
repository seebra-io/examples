data.group_by("rover", "sol")
    .agg(images = len(), cameras = col("camera").n_unique())
    .with_columns(first_sol = col("sol").min(), last_sol = col("sol").max(), window_images = col("images").sum(),
                  sols_with_images = len())
    .with_columns(sols_spanned = col("last_sol") - col("first_sol") + 1)
    .with_columns(per_sol = (col("window_images") / col("sols_spanned")).round(1),
                  per_sol_lo = (gamma_ppf(0.025, col("window_images"), col("sols_spanned"))).round(1),
                  per_sol_hi = (gamma_ppf(0.975, col("window_images") + 1, col("sols_spanned"))).round(1),
                  per_sol_with_images = (col("window_images") / col("sols_with_images")).round(1))
    .sort("sol")