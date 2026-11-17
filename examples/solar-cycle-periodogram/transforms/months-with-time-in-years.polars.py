data.select(tag = col("time-tag"), ssn = col("ssn").cast(Float64), smoothed = col("smoothed_ssn").cast(Float64))
    .with_columns(year = col("tag").str.slice(0, 4).cast(Int64), month = col("tag").str.slice(5, 2).cast(Int64))
    .with_columns(t = col("year").cast(Float64) + (col("month").cast(Float64) - 0.5) / 12,
                  smoothed = when(col("smoothed") >= 0).then(col("smoothed")))
    .filter(col("ssn") >= 0)
    .sort("t")
    .with_row_index("i")
    .with_columns(i = col("i").cast(Int64))