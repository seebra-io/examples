# the same daily rate, but each value the mean of its 24 hours: a low-pass (anti-aliasing) filter before sampling
data.with_columns(d = col("h0") // 24)
    .group_by("d")
    .agg(t = col("t").first(), h0 = col("h0").min(), level_m = col("level_m").mean(), x = col("x").mean(), hours = len())
    .filter(col("hours") == 24)
    .select(scheme = lit("daily mean (filtered)"), step_h = lit(24), fs_cpd = lit(1.0), nyquist_cpd = lit(0.5),
            t = col("t"), h0 = col("h0"), day = col("h0").cast(Float64) / 24, level_m = col("level_m").round(4), x = col("x").round(4))
    .sort("h0")