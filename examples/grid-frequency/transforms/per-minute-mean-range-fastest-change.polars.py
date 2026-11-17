data.group_by("minute")
    .agg(t = col("t").min(), mean_df_mhz = col("df_mhz").mean().round(2),
         min_df_mhz = col("df_mhz").min(), max_df_mhz = col("df_mhz").max(),
         max_abs_rocof_mhz_s = col("rocof_mhz_s").abs().max(),
         mean_fcr_mw = col("fcr_mw").mean().round(0), seconds = len())
    .with_columns(time = (col("t") * 1000000).cast(Datetime).dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
                  clock = (col("t") * 1000000).cast(Datetime).dt.strftime("%H:%M"))
    .sort("t")