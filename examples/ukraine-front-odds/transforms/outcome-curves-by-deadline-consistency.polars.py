# The probability of each outcome by deadline (its term structure), for the
# "by ...?" and "continues through ...?" events with at least two deadlines.
# A later deadline can only make "X by then" more likely: a price that falls
# with the deadline (or rises, for "continues through") is inconsistent,
# usually a thin market (wide spread, little volume): check before reading it.
data.filter(col("shape") != "single")
    .with_columns(n = len().over("event"), deadlines = col("deadline").n_unique().over("event"))
    .filter((col("n") >= 2) & (col("deadlines") == col("n")))
    .sort("event", "deadline")
    .with_columns(prev = col("yes").shift(1).over("event"))
    .with_columns(consistent = when(col("prev").is_null()).then(lit(True))
                               .when(col("shape") == "cumulative").then(col("yes") >= col("prev") - 0.02)
                               .otherwise(col("yes") <= col("prev") + 0.02))
    .select("event", "deadline", "yes", "shape", "consistent", "spread", "volume_usd", "liquidity_usd", "question", "url")
