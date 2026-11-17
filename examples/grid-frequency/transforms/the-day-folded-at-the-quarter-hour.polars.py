# the day folded at the quarter-hour: every :00, :15, :30 and :45 laid on top of each other
data.group_by("quarter_of_hour", "sec_of_quarter")
    .agg(mean_df_mhz = col("df_mhz").mean(), sd_df_mhz = col("df_mhz").std(), quarters = len(),
         mean_abs_rocof_mhz_s = col("rocof_mhz_s").abs().mean())
    .with_columns(se = col("sd_df_mhz") / col("quarters").cast(Float64).sqrt(),
                  starts_at = concat_str([lit(":"), when(col("quarter_of_hour") == 0).then(lit("00")).when(col("quarter_of_hour") == 1).then(lit("15"))
                                                     .when(col("quarter_of_hour") == 2).then(lit("30")).otherwise(lit("45"))]),
                  minute_in_quarter = col("sec_of_quarter").cast(Float64) / 60)
    .with_columns(lo = (col("mean_df_mhz") - 1.96 * col("se")).round(2), hi = (col("mean_df_mhz") + 1.96 * col("se")).round(2),
                  mean_df_mhz = col("mean_df_mhz").round(2), sd_df_mhz = col("sd_df_mhz").round(2),
                  mean_abs_rocof_mhz_s = col("mean_abs_rocof_mhz_s").round(3), minute_in_quarter = col("minute_in_quarter").round(3))
    .drop("se")
    .sort("quarter_of_hour", "sec_of_quarter")