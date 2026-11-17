data.group_by("kind", "order")
    .agg(n = len(), mean_A = col("length").mean().round(3), min_A = col("length").min(), max_A = col("length").max(),
         spread_A = (col("length").max() - col("length").min()).round(3))
    .sort("mean_A")