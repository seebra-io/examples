data.group_by("restarts").agg(containers = len())
    .sort("restarts", descending=True)
    .with_columns(at_least = col("containers").cum_sum(),
                  restarts_held = (col("restarts") * col("containers")).cum_sum())
    .with_columns(share = col("at_least") / col("containers").sum(),
                  restart_share = col("restarts_held") / (col("restarts") * col("containers")).sum(),
                  mean = (col("restarts") * col("containers")).sum() / col("containers").sum())
    .sort("restarts")