# the frequency grid: 0 to 4.5 cycles per day in steps of 1/112 (half the 1/56-day resolution of an 8-week record)
data.head(505).with_row_index("j")
    .select(f_cpd = col("j").cast(Float64) / 112)