data.rows("daily.time").rename({"value": "date"}).with_row_index("i")
    .join(data.rows("daily.precipitation_sum").rename({"value": "mm"}).with_row_index("i"), on="i")
    .select("date", year = col("date").str.slice(0, 4).cast(Int64), mm = col("mm").cast(Float64))
    .filter(col("mm").is_not_null())