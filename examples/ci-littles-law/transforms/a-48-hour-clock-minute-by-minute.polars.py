# a clock of 2880 minutes (two days, so runs that end after midnight are counted to the end)
data.select("id").join(data.select(id2 = col("id")), how="cross").head(2880).with_row_index("m")
    .select(m = col("m").cast(Int64), t_min = col("m").cast(Float64) + 0.5)