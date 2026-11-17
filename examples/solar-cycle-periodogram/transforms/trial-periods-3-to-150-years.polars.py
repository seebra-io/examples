data.with_row_index("k").filter(col("k") < 400)
    # 400 periods spaced evenly in log from 3 to 150 years (yearly means: the shortest resolvable period is 2 years)
    .select(period_yr = 3 * (col("k").cast(Float64) / 399 * 3.912023005).exp())