# hourly heights, with time as hours and days since the first one
data.rows("data")
    .select("t", level_m = col("v").cast(Float64, strict=False),
            h = col("t").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 24 + col("t").str.slice(11, 2).cast(Int64))
    .filter(col("level_m").is_not_null())
    .with_columns(h0 = col("h") - col("h").min(), x = col("level_m") - col("level_m").mean())
    .with_columns(day = col("h0").cast(Float64) / 24)
    .select("t", "h0", "day", "level_m", x = col("x").round(4))
    .sort("h0")