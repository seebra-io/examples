data.group_by("currency", "month")
    .agg(days = len(), mean_pct = col("log_return_pct").mean().round(3), sd_pct = col("log_return_pct").std().round(3),
         biggest_pct = col("log_return_pct").abs().max().round(2))
    .with_columns(vol_pct = (col("sd_pct") * (252 ** 0.5)).round(1))
    .sort(["currency", "month"])