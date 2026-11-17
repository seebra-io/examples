data.group_by("discoverymethod")
    .agg(planets = len(), median_log_ratio = col("log_ratio").median(),
         p05 = col("log_ratio").quantile(0.05, "linear"), p95 = col("log_ratio").quantile(0.95, "linear"),
         share_consistent = (col("log_ratio").abs() < 0.0043).cast(Float64).mean(),
         median_a_au = col("a_au").median(), median_period_days = col("period_days").median())
    .with_columns(median_log_ratio = col("median_log_ratio").round(4), p05 = col("p05").round(3), p95 = col("p95").round(3),
                  share_consistent = col("share_consistent").round(3), median_a_au = col("median_a_au").round(3), median_period_days = col("median_period_days").round(1),
                  mass_spread_pct = ((lit(10.0).pow(col("p95")) - lit(10.0).pow(col("p05"))) * 50).round(1))
    .sort("planets", descending=True)