data.filter(col("pm2_5").is_not_null())
    .group_by("city")
    .agg(hours = len(),
         p10 = col("pm2_5").quantile(0.1).round(1),
         p25 = col("pm2_5").quantile(0.25).round(1),
         median = col("pm2_5").median().round(1),
         p75 = col("pm2_5").quantile(0.75).round(1),
         p90 = col("pm2_5").quantile(0.9).round(1),
         max = col("pm2_5").max(),
         hours_over = (col("pm2_5") > 15).cast(Int64).sum())
    .join(data1.group_by("city").agg(days = len(), days_over = (col("pm2_5") > 15).cast(Int64).sum()), on="city")
    .with_columns(share_hours_over_pct = (100 * col("hours_over") / col("hours")).round(0))
    .sort("median", descending=True)