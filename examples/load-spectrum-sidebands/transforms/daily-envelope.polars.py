# the modulation itself: each day's mean load and daily swing (max - min); weekends carry a smaller, lower day
data.with_columns(d = col("k") // 24)
    .group_by("d")
    .agg(date = col("time").first().str.slice(0, 10), weekday = col("weekday").first(), mean_gw = col("load_gw").mean(),
         max_gw = col("load_gw").max(), min_gw = col("load_gw").min())
    .with_columns(swing_gw = (col("max_gw") - col("min_gw")).round(2), mean_gw = col("mean_gw").round(2),
                  day_type = when(col("weekday") == 5).then(lit("Saturday")).when(col("weekday") == 6).then(lit("Sunday")).otherwise(lit("Mon–Fri")))
    .select("d", "date", "weekday", "day_type", "mean_gw", "swing_gw", "max_gw", "min_gw")
    .sort("d")