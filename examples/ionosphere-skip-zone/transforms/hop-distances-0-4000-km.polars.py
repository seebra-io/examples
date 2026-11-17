# ground distances for one hop, 0 to 4000 km in 100 km steps
data.head(41).with_row_index("i").select(d_km = col("i").cast(Float64) * 100)