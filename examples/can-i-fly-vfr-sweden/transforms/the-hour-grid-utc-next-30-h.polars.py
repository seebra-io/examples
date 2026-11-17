# The hour grid: SMHI's forecast hours (UTC, hourly for the first two
# days), the next 30 h from the model run. ISO time to s since 1970.
data.rows("timeSeries")
    .select("time")
    .with_columns(t = col("time").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 86400
                      + col("time").str.slice(11, 2).cast(Int64) * 3600)
    .filter(col("t") <= col("t").min() + 30 * 3600)
    .with_columns(hour = (col("t") * 1000000).cast(Int64).cast(Datetime).dt.strftime("%d %H:00Z"))
    .select("t", "hour")