data.group_by("symbol", "name")
    .agg(hours = len(), market_cap = col("market_cap").first(), sd_hourly = col("log_return").std(), return_7d = col("log_return").sum())
    .with_columns(vol_daily_pct = 100 * col("sd_hourly") * lit(24.0).sqrt(), return_7d_pct = 100 * col("return_7d"))
    .sort("market_cap", descending=True)