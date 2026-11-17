data.sort("period", "max_mm").with_row_index("idx")
    .with_columns(n = len().over("period"),
                  rank = col("idx") - col("idx").min().over("period") + 1,
                  mean = col("max_mm").mean().over("period"),
                  sd = col("max_mm").std().over("period"))
    .with_columns(beta = col("sd") * 0.7796968012336761,
                  p = (col("rank").cast(Float64) - 0.44) / (col("n").cast(Float64) + 0.12))
    .with_columns(mu = col("mean") - 0.5772156649 * col("beta"),
                  gumbel_y = -(-col("p").log()).log(),
                  return_period = 1 / (1 - col("p")))
    .with_columns(fitted_mm = col("mu") + col("beta") * col("gumbel_y"))
    .with_columns(return_period = col("return_period").round(1), gumbel_y = col("gumbel_y").round(3), fitted_mm = col("fitted_mm").round(1),
                  mu = col("mu").round(2), beta = col("beta").round(2))
    .select("period", "year", "date", "max_mm", "rank", "n", "return_period", "gumbel_y", "fitted_mm", "mu", "beta", "mean", "sd")
    .sort("period", "max_mm")