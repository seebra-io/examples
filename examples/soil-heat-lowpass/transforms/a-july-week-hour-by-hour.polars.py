# one summer week, hour by hour, every layer
data.filter((col("time") >= "2024-07-08T00:00") & (col("time") < "2024-07-15T00:00"))
    .select("layer", "depth_m", "k", "time", "temp_c")
    .sort("k", "time")