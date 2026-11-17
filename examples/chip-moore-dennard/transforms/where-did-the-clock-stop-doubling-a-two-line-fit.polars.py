# Clock frequency, log2(MHz) against year: for every candidate break year from
# 1995 to 2014, fit one straight line before it and one from it on, and add up
# their squared residuals (SSE). The break that explains the data best has
# the smallest SSE. slope: doublings per year on each side.
data.filter(col("series") == "frequency").select("year", "log2_value")
    .join(data.filter((col("series") == "frequency") & (col("year") >= 1995) & (col("year") < 2015)).select(brk = col("year").floor().cast(Int64)).unique(), how="cross")
    .with_columns(side = when(col("year") < col("brk")).then(lit("before")).otherwise(lit("after")))
    .group_by("brk", "side")
    .agg(n = len(),
         sxx = (col("year") - col("year").mean()).pow(2).sum(),
         sxy = ((col("year") - col("year").mean()) * (col("log2_value") - col("log2_value").mean())).sum(),
         syy = (col("log2_value") - col("log2_value").mean()).pow(2).sum())
    .with_columns(sse = col("syy") - col("sxy").pow(2) / col("sxx"), slope = col("sxy") / col("sxx"))
    .group_by("brk")
    .agg(sse = col("sse").sum(),
         n_before = when(col("side") == "before").then(col("n")).otherwise(None).max(),
         n_after = when(col("side") == "after").then(col("n")).otherwise(None).max(),
         slope_before = when(col("side") == "before").then(col("slope")).otherwise(None).max(),
         slope_after = when(col("side") == "after").then(col("slope")).otherwise(None).max())
    .filter((col("n_before") >= 5) & (col("n_after") >= 5))
    .with_columns(best = col("sse") == col("sse").min(),
                  sse = col("sse").round(3), slope_before = col("slope_before").round(4), slope_after = col("slope_after").round(4))
    .sort("brk")