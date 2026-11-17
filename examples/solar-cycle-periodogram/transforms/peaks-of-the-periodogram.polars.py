data.sort("series", "period_yr")
    .with_columns(prev = col("power").shift(1).over("series"), next = col("power").shift(-1).over("series"),
                  top = col("power").max().over("series"))
    .filter((col("power") > col("prev")) & (col("power") > col("next")))
    .with_columns(relative = (col("power") / col("top")).round(3), period_yr = col("period_yr").round(2))
    .filter(col("relative") >= 0.1)
    .select("series", "period_yr", "relative", "power")
    .sort("series", "relative", descending=[False, True])