# paired t-test over the quarter-hours: is |Δf| larger in the first 2 minutes?
data.select(quarters = len(),
            mean_diff_abs_df_mhz = col("diff_abs_df_mhz").mean(), sd_diff_abs_df_mhz = col("diff_abs_df_mhz").std(),
            share_first_larger = (col("diff_abs_df_mhz") > 0).cast(Float64).mean(),
            mean_diff_rocof = col("diff_rocof").mean(), sd_diff_rocof = col("diff_rocof").std(),
            mean_first_abs_df_mhz = col("first_abs_df_mhz").mean(), mean_rest_abs_df_mhz = col("rest_abs_df_mhz").mean())
    .with_columns(t_abs_df = col("mean_diff_abs_df_mhz") / (col("sd_diff_abs_df_mhz") / col("quarters").cast(Float64).sqrt()),
                  t_rocof = col("mean_diff_rocof") / (col("sd_diff_rocof") / col("quarters").cast(Float64).sqrt()))
    .with_columns(p_abs_df_one_sided = (1 - t_cdf(col("t_abs_df"), col("quarters") - 1)),
                  p_rocof_one_sided = (1 - t_cdf(col("t_rocof"), col("quarters") - 1)),
                  ci95_lo = col("mean_diff_abs_df_mhz") - t_ppf(0.975, col("quarters") - 1) * col("sd_diff_abs_df_mhz") / col("quarters").cast(Float64).sqrt(),
                  ci95_hi = col("mean_diff_abs_df_mhz") + t_ppf(0.975, col("quarters") - 1) * col("sd_diff_abs_df_mhz") / col("quarters").cast(Float64).sqrt())
    .select("quarters", mean_first_abs_df_mhz = col("mean_first_abs_df_mhz").round(2), mean_rest_abs_df_mhz = col("mean_rest_abs_df_mhz").round(2),
            mean_diff_abs_df_mhz = col("mean_diff_abs_df_mhz").round(2), ci95_lo = col("ci95_lo").round(2), ci95_hi = col("ci95_hi").round(2),
            share_first_larger = col("share_first_larger").round(3), t_abs_df = col("t_abs_df").round(2), p_abs_df_one_sided = col("p_abs_df_one_sided").round(5),
            mean_diff_rocof_mhz_s = col("mean_diff_rocof").round(3), t_rocof = col("t_rocof").round(2), p_rocof_one_sided = col("p_rocof_one_sided").round(5))