data.select(seconds = len(),
            first_t = col("t").min(), last_t = col("t").max(),
            mean_df_mhz = col("df_mhz").mean().round(2), sd_df_mhz = col("df_mhz").std().round(2),
            min_df_mhz = col("df_mhz").min(), max_df_mhz = col("df_mhz").max(),
            share_in_deadband_10 = ((col("abs_df_mhz") <= 10).cast(Float64).mean() * 100).round(1),
            share_within_20 = ((col("abs_df_mhz") <= 20).cast(Float64).mean() * 100).round(1),
            share_within_50 = ((col("abs_df_mhz") <= 50).cast(Float64).mean() * 100).round(2),
            share_within_200 = ((col("abs_df_mhz") <= 200).cast(Float64).mean() * 100).round(2),
            max_abs_rocof_mhz_s = col("rocof_mhz_s").abs().max(),
            mean_abs_fcr_mw = col("fcr_mw").abs().mean().round(0), max_abs_fcr_mw = col("fcr_mw").abs().max())
    .with_columns(day = (col("first_t") * 1000000).cast(Datetime).dt.strftime("%Y-%m-%d"),
                  covered_pct = (col("seconds").cast(Float64) / (col("last_t") - col("first_t") + 1).cast(Float64) * 100).round(2))