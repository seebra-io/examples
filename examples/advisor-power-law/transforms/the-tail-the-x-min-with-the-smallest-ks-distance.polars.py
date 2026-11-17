data.filter(col("ks") == col("ks").min())
    .with_columns(alpha_lo = (col("alpha") - 1.96 * col("se_alpha")).round(3), alpha_hi = (col("alpha") + 1.96 * col("se_alpha")).round(3))