# metered output of Westermost Rough (BM unit T_WTMSO-1) per settlement half-hour: MWh in 30 minutes, so MW = 2 × quantity.
# The hour a half-hour belongs to: its end time minus one second, floored to the hour (UTC)
data.select(end = col("halfHourEndTime"), run = col("settlementRunType"), mwh = col("quantity").cast(Float64, strict=False))
    .filter(col("mwh").is_not_null())
    .with_columns(end_s = col("end").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 86400
                          + col("end").str.slice(11, 2).cast(Int64) * 3600 + col("end").str.slice(14, 2).cast(Int64) * 60)
    .with_columns(h = (col("end_s") - 1) // 3600)
    .group_by("h")
    .agg(mw = (col("mwh") * 2).mean(), halves = len(), run = col("run").first())
    .filter(col("halves") == 2)
    .sort("h")