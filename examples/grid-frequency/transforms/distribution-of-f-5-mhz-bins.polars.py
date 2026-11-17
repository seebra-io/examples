data.with_columns(bin_mhz = (col("df_mhz") / 5).floor() * 5)
    .group_by("bin_mhz").agg(seconds = len())
    .with_columns(share = (col("seconds") / col("seconds").sum()).round(5),
                  bin_end_mhz = col("bin_mhz") + 5)
    .sort("bin_mhz")