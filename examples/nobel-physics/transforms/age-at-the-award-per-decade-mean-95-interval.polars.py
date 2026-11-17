data.filter(col("age").is_not_null())
    .group_by("decade")
    .agg(n = len(), mean_age = col("age").mean(), sd = col("age").std(), median_age = col("age").median(),
         p10 = col("age").quantile(0.1), p90 = col("age").quantile(0.9),
         youngest = col("age").min(), oldest = col("age").max())
    .with_columns(half_width = t_ppf(0.975, col("n") - 1) * col("sd") / col("n").cast(Float64).sqrt())
    .with_columns(lo = (col("mean_age") - col("half_width")).round(1), hi = (col("mean_age") + col("half_width")).round(1),
                  mean_age = col("mean_age").round(1), sd = col("sd").round(1), mid = col("decade") + 5)
    .drop("half_width")
    .sort("decade")