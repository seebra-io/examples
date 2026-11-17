# one pair per quarter-hour: its first two minutes against the rest of it (the seconds within a quarter are not independent; the quarters nearly are)
data.filter(col("window") == "first 2 min").select("quarter", first_abs_df_mhz = col("mean_abs_df_mhz"), first_df_mhz = col("mean_df_mhz"), first_rocof = col("mean_abs_rocof_mhz_s"))
    .join(data.filter(col("window") == "rest").select("quarter", rest_abs_df_mhz = col("mean_abs_df_mhz"), rest_df_mhz = col("mean_df_mhz"), rest_rocof = col("mean_abs_rocof_mhz_s")), on="quarter")
    .with_columns(diff_abs_df_mhz = col("first_abs_df_mhz") - col("rest_abs_df_mhz"),
                  diff_rocof = col("first_rocof") - col("rest_rocof"),
                  starts = (col("quarter") * 900 * 1000000).cast(Datetime).dt.strftime("%H:%M"),
                  on_the_hour = (col("quarter") % 4 == 0))
    .with_columns(first_abs_df_mhz = col("first_abs_df_mhz").round(2), rest_abs_df_mhz = col("rest_abs_df_mhz").round(2),
                  diff_abs_df_mhz = col("diff_abs_df_mhz").round(2), first_rocof = col("first_rocof").round(3), rest_rocof = col("rest_rocof").round(3),
                  diff_rocof = col("diff_rocof").round(3), first_df_mhz = col("first_df_mhz").round(2), rest_df_mhz = col("rest_df_mhz").round(2))
    .sort("quarter")