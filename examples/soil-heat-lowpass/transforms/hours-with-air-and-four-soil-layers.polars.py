data.rows("hourly.time").rename({"value": "time"}).with_row_index("h")
    .join(data.rows("hourly.temperature_2m").rename({"value": "air"}).with_row_index("h"), on="h")
    .join(data.rows("hourly.soil_temperature_0_to_7cm").rename({"value": "soil_0_7"}).with_row_index("h"), on="h")
    .join(data.rows("hourly.soil_temperature_7_to_28cm").rename({"value": "soil_7_28"}).with_row_index("h"), on="h")
    .join(data.rows("hourly.soil_temperature_28_to_100cm").rename({"value": "soil_28_100"}).with_row_index("h"), on="h")
    .join(data.rows("hourly.soil_temperature_100_to_255cm").rename({"value": "soil_100_255"}).with_row_index("h"), on="h")
    .select(h = col("h").cast(Int64), time = col("time"), air = col("air").cast(Float64), soil_0_7 = col("soil_0_7").cast(Float64),
            soil_7_28 = col("soil_7_28").cast(Float64), soil_28_100 = col("soil_28_100").cast(Float64), soil_100_255 = col("soil_100_255").cast(Float64))
    .sort("h")