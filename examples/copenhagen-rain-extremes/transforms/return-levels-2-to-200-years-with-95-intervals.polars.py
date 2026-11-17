data.group_by("period").agg(n = col("n").first(), mu = col("mu").first(), beta = col("beta").first(), sd = col("sd").first())
    .join(data.with_row_index("k").filter(col("k") < 7)
              .select(T = when(col("k") == 0).then(2).when(col("k") == 1).then(5).when(col("k") == 2).then(10)
                          .when(col("k") == 3).then(20).when(col("k") == 4).then(50).when(col("k") == 5).then(100).otherwise(200)),
          how="cross")
    .with_columns(gumbel_y = -(-(1 - 1 / col("T").cast(Float64)).log()).log())
    .with_columns(level_mm = col("mu") + col("beta") * col("gumbel_y"),
                  K = 0.7796968012336761 * (col("gumbel_y") - 0.5772156649))
    .with_columns(se_mm = col("sd") / col("n").cast(Float64).sqrt() * (1 + 1.1396 * col("K") + 1.1 * col("K").pow(2)).sqrt())
    .with_columns(lo_mm = (col("level_mm") - 1.96 * col("se_mm")).round(1), hi_mm = (col("level_mm") + 1.96 * col("se_mm")).round(1),
                  level_mm = col("level_mm").round(1), se_mm = col("se_mm").round(1), gumbel_y = col("gumbel_y").round(3))
    .select("period", "T", "level_mm", "lo_mm", "hi_mm", "se_mm", "gumbel_y", "n", "mu", "beta")
    .sort("period", "T")