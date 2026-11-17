data.select(paintings = len(),
            q10 = col("midpoint").quantile(0.1), q25 = col("midpoint").quantile(0.25),
            median = col("midpoint").median(),
            q75 = col("midpoint").quantile(0.75), q90 = col("midpoint").quantile(0.9),
            exact = (col("span") == 0).cast(Int64).sum(),
            median_span = col("span").median())