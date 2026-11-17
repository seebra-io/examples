# both gauges on one 15-minute clock; ft³/s to m³/s
data.rows("features").select(time = col("properties").struct.field("time"), q_up_cfs = col("properties").struct.field("value").cast(Float64, strict=False))
    .join(data1.rows("features").select(time = col("properties").struct.field("time"), q_down_cfs = col("properties").struct.field("value").cast(Float64, strict=False)), on="time")
    .filter(col("q_up_cfs").is_not_null() & col("q_down_cfs").is_not_null())
    .sort("time")
    .with_row_index("i")
    .select(i = col("i").cast(Int64), time = col("time").str.slice(0, 16),
            q_up = (col("q_up_cfs") * 0.0283168).round(1), q_down = (col("q_down_cfs") * 0.0283168).round(1))
    .with_columns(dq_up = col("q_up") - col("q_up").shift(1), dq_down = col("q_down") - col("q_down").shift(1))