# Tetrahedral against octahedral compounds only. For every observed Δχ as a
# threshold t, predict 'tetrahedral' when Δχ < t and count how many compounds
# that gets right. best: the threshold(s) with the highest accuracy.
data.filter(col("coordination").is_in(["tetrahedral (4)", "octahedral (6)"])).select("delta_chi", "coordination")
    .join(data.filter(col("coordination").is_in(["tetrahedral (4)", "octahedral (6)"])).select(t = col("delta_chi")).unique(), how="cross")
    .with_columns(right = ((col("delta_chi") < col("t")) == (col("coordination") == "tetrahedral (4)")).cast(Int64))
    .group_by("t")
    .agg(n = len(), correct = col("right").sum())
    .with_columns(accuracy = (col("correct") / col("n")).round(4))
    .with_columns(best = col("accuracy") == col("accuracy").max())
    .sort("t")