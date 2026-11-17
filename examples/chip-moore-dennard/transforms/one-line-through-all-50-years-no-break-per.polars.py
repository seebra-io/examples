# The null model: a single constant doubling time for the whole half-century.
data.group_by("series")
    .agg(n = len(),
         sxx = (col("year") - col("year").mean()).pow(2).sum(),
         sxy = ((col("year") - col("year").mean()) * (col("log2_value") - col("log2_value").mean())).sum(),
         syy = (col("log2_value") - col("log2_value").mean()).pow(2).sum())
    .with_columns(slope_all = (col("sxy") / col("sxx")).round(4),
                  sse_all = (col("syy") - col("sxy").pow(2) / col("sxx")).round(3),
                  doubling_years_all = (col("sxx") / col("sxy")).round(2))
    .select("series", "n", "slope_all", "doubling_years_all", "sse_all")
    .sort("series")