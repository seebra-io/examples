# Germany's load, hourly means of the quarter-hours, 8 whole weeks (Monday 24 Aug to Sunday 18 Oct 2026, all in CEST)
data.rows("production_types")
    .filter(col("name") == "Load")
    .explode("data")
    .with_row_index("i")
    .join(data.rows("unix_seconds").with_row_index("i"), on="i")
    .select(t = col("value"), mw = col("data"))
    .filter(col("mw").is_not_null())
    .with_columns(h = col("t") // 3600)
    .group_by("h")
    .agg(load_gw = col("mw").mean() / 1000, n = len())
    .filter(col("n") == 4)
    .sort("h")
    .with_columns(k = col("h") - col("h").min())
    .with_columns(day = col("k").cast(Float64) / 24,
                  time = (col("h") * 3600 * 1000000).cast(Datetime).dt.strftime("%Y-%m-%d %H:00 UTC"),
                  weekday = ((col("k") // 24) % 7),
                  local_hour = (col("h") + 2) % 24,
                  kf = col("k").cast(Float64))
    # remove the straight-line trend (autumn's rising demand) so it doesn't leak over the low frequencies
    .with_columns(b = ((col("kf") * col("load_gw")).mean() - col("kf").mean() * col("load_gw").mean()) / ((col("kf") * col("kf")).mean() - col("kf").mean() * col("kf").mean()))
    .with_columns(x = col("load_gw") - col("load_gw").mean() - col("b") * (col("kf") - col("kf").mean()),
                  trend_gw_per_week = col("b") * 168)
    .with_columns(weekend = col("weekday") >= 5,
                  # Hann window over the whole record: 0.5 (1 - cos 2πk/N)
                  N = col("k").max() + 1)
    .select("time", "k", "day", "weekday", "weekend", "local_hour", load_gw = col("load_gw").round(3), x = col("x").round(4), N = col("N"),
            trend_gw_per_week = col("trend_gw_per_week").round(3))