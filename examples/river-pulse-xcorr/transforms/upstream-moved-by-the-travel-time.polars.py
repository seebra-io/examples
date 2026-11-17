# the upstream record moved forward by the best lag, on top of the downstream one
data.join(data1.select("best_lag"), how="cross")
    .with_columns(j = col("i") + col("best_lag"))
    .select("j", q_up_shifted = col("q_up"))
    .join(data.select(j = col("i"), time = col("time"), q_up = col("q_up"), q_down = col("q_down")), on="j", how="right")
    .select("time", "q_up", "q_down", "q_up_shifted")
    .sort("time")