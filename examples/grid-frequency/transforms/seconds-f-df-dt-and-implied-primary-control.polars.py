# one row per second: frequency deviation from 50 Hz, rate of change, implied primary-control power
data.rows("unix_seconds").rename({"value": "t"}).with_row_index("i")
    .join(data.rows("data").rename({"value": "f_hz"}).with_row_index("i"), on="i")
    .filter(col("f_hz").is_not_null())
    .select("t", "f_hz",
            df_mhz = ((col("f_hz") - 50) * 1000).round(1),
            sec_of_quarter = col("t") % 900,
            quarter_of_hour = (col("t") % 3600) // 900,
            quarter = col("t") // 900,
            minute = col("t") // 60)
    .sort("t")
    .with_columns(abs_df_mhz = col("df_mhz").abs(),
                  # df/dt in mHz/s, only between consecutive seconds
                  rocof_mhz_s = when(col("t") - col("t").shift(1) == 1).then(col("df_mhz") - col("df_mhz").shift(1)).otherwise(lit(None)),
                  # FCR (primary control): 3000 MW in Continental Europe, fully activated at ±200 mHz, proportional in between
                  fcr_mw = (-col("df_mhz") / 200 * 3000).clip(-3000, 3000).round(0),
                  window = when(col("t") % 900 < 120).then(lit("first 2 min")).otherwise(lit("rest")))