data.with_columns(lam = col("holidays").sum() / 7, sum_sq = (col("holidays") * col("holidays")).sum())
    .with_columns(variance = (col("sum_sq") - 7 * col("lam") * col("lam")) / 6)
    .with_columns(dispersion = (col("variance") / col("lam")).round(2),
                  p_overdispersed = (1 - chi2_cdf(6 * col("variance") / col("lam"), 6)).round(3),
                  p_at_least = gamma_cdf(col("lam"), col("holidays"), 1).round(3),
                  lam = col("lam").round(2))
    .drop("sum_sq", "variance")