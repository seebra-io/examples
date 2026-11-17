SELECT quarter, "window", COUNT(*) AS seconds,
       AVG(abs_df_mhz) AS mean_abs_df_mhz, AVG(df_mhz) AS mean_df_mhz, AVG(ABS(rocof_mhz_s)) AS mean_abs_rocof_mhz_s
FROM data GROUP BY quarter, "window" ORDER BY quarter, "window"