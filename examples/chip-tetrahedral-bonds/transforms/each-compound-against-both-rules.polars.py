# The discriminant score s = wx·Δχ + wy·n̄ − b: positive predicts tetrahedral.
# Also the one-threshold rule (the best Δχ threshold, the lowest if tied).
data.join(data1.select("wx", "wy", "b"), how="cross")
    .join(data2.filter(col("best")).select("t").sort("t").head(1), how="cross")
    .with_columns(score = (col("wx") * col("delta_chi") + col("wy") * col("n_bar") - col("b")).round(3))
    .with_columns(lda_says = when(col("score") > 0).then(lit("tetrahedral (4)")).otherwise(lit("octahedral (6)")),
                  stump_says = when(col("delta_chi") < col("t")).then(lit("tetrahedral (4)")).otherwise(lit("octahedral (6)")))
    .with_columns(lda_right = when(col("coordination").is_in(["tetrahedral (4)", "octahedral (6)"])).then(col("lda_says") == col("coordination")).otherwise(None),
                  stump_right = when(col("coordination").is_in(["tetrahedral (4)", "octahedral (6)"])).then(col("stump_says") == col("coordination")).otherwise(None))
    .select("formula", "family", "structure", "coordination", "delta_chi", "n_bar", "score", "lda_says", "lda_right", "stump_says", "stump_right", "gap_ev", "sg", "link", threshold = col("t"))
    .sort("score", descending=True)