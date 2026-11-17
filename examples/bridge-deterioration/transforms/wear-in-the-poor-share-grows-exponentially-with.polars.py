# Ages 5-44: before rehabilitation and replacement start to hold the poor share down (see the chart: it bends at ~45).
data.filter((col("band") >= 5) & (col("band") <= 40) & col("log_poor").is_not_null())
    .with_columns(mx = col("age_mid").mean(), my = col("log_poor").mean())
    .with_columns(dx = col("age_mid") - col("mx"), dy = col("log_poor") - col("my"))
    .with_columns(slope = (col("dx") * col("dy")).sum() / col("dx").pow(2).sum())
    .with_columns(res = col("dy") - col("slope") * col("dx"))
    .select(bands = len(), growth_per_year = col("slope").first(),
            se = ((col("res").pow(2).sum() / (len() - 2)) / col("dx").pow(2).sum()).sqrt(),
            r2 = 1 - col("res").pow(2).sum() / col("dy").pow(2).sum(),
            intercept = (col("my") - col("slope") * col("mx")).first())
    .with_columns(doubling_years = (0.6931471805599453 / col("growth_per_year")).round(1),
                  share_poor_at_50 = (col("intercept") + 50 * col("growth_per_year")).exp().round(4),
                  growth_per_year = col("growth_per_year").round(4), se = col("se").round(4), r2 = col("r2").round(4), intercept = col("intercept").round(3))