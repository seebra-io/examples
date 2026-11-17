data.sort("miss_ld")
    .with_row_index("rank")
    .with_columns(rank = col("rank") + 1, n = len())
    .with_columns(share = (col("rank") / col("n")).round(3),
                  median_ld = col("miss_ld").median().round(1),
                  within_1_ld = (col("miss_ld") <= 1).cast(Int64).sum(),
                  within_10_ld = (col("miss_ld") <= 10).cast(Int64).sum(),
                  within_100_ld = (col("miss_ld") <= 100).cast(Int64).sum(),
                  miss_ld = col("miss_ld").round(2),
                  diameter_m = col("diameter_m").round(0))
    .select("rank", "name", "date", "miss_ld", "share", "diameter_m", "hazardous", "n", "median_ld",
            "within_1_ld", "within_10_ld", "within_100_ld")