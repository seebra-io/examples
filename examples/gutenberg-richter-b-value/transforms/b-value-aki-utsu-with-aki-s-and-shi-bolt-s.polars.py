data.join(data1, how="cross")
    .filter(col("m") >= col("mc") - 1e-9)
    .group_by("mc")
    .agg(quakes = len(), mean_m = col("m").mean(), var_sum = (col("m") - col("m").mean()).pow(2).sum(), max_m = col("m").max())
    # Aki–Utsu maximum likelihood with 0.1 bins: b = log₁₀e / (mean M − (Mc − ΔM/2)); a from N(≥Mc)
    .with_columns(b = 0.4342945 / (col("mean_m") - (col("mc") - 0.05)))
    .with_columns(b_se_aki = col("b") / col("quakes").cast(Float64).sqrt(),
                  b_se_shi_bolt = 2.30 * col("b").pow(2) * (col("var_sum") / (col("quakes") * (col("quakes") - 1))).sqrt(),
                  a = col("quakes").cast(Float64).log(10) + col("b") * col("mc"))
    .with_columns(expected_m7_per_year = lit(10.0).pow(col("a") - col("b") * 6.95),
                  expected_m8_per_year = lit(10.0).pow(col("a") - col("b") * 7.95))
    .with_columns(b = col("b").round(3), b_se_aki = col("b_se_aki").round(3), b_se_shi_bolt = col("b_se_shi_bolt").round(3), a = col("a").round(2),
                  mean_m = col("mean_m").round(3), expected_m7_per_year = col("expected_m7_per_year").round(1), expected_m8_per_year = col("expected_m8_per_year").round(2))
    .drop("var_sum")