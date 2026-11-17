# how often the gauge is read: every hour (the reference), every 6, 11, 24 and 25 hours
data.head(5).with_row_index("k")
    .select(step_h = when(col("k") == 0).then(1).when(col("k") == 1).then(6).when(col("k") == 2).then(11).when(col("k") == 3).then(24).otherwise(25))
    .with_columns(fs_cpd = 24 / col("step_h").cast(Float64),
                  scheme = concat_str([lit("every "), col("step_h").cast(Utf8), lit(" h")]))
    .with_columns(nyquist_cpd = col("fs_cpd") / 2)