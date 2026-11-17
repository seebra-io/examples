data.group_by("series", "period_yr")
    .agg(re = col("re").sum(), im = col("im").sum(), years = len())
    .with_columns(power = (col("re").pow(2) + col("im").pow(2)) / col("years"))
    .sort("series", "period_yr")