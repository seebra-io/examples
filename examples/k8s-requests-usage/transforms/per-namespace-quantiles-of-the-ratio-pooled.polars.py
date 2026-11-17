data.filter(col("ratio") > 0)
    .group_by("namespace", "resource")
    .agg(containers = len(),
         p10 = col("ratio").quantile(0.1),
         median = col("ratio").median(),
         p90 = col("ratio").quantile(0.9),
         used = col("used").sum(),
         requested = col("requested").sum())
    .with_columns(pooled = col("used") / col("requested"),
                  idle = col("requested") - col("used"))
    .sort("idle", descending=True)