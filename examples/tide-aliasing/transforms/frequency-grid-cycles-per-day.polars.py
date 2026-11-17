# the frequency grid: 0.004 to 2.2 cycles per day (a 123-day record resolves about 1/123 = 0.008)
data.head(550).with_row_index("k")
    .select(f_cpd = (col("k").cast(Float64) + 1) * 0.004)