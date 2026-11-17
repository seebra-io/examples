data.group_by("m").agg(n = len(), energy_j = col("energy_j").sum())
    .sort("m", descending=True)
    .with_columns(n_at_least = col("n").cum_sum(), energy_share = col("energy_j") / col("energy_j").sum())
    .with_columns(log_n = col("n").cast(Float64).log(10), log_n_at_least = col("n_at_least").cast(Float64).log(10),
                  energy_share_at_least = col("energy_share").cum_sum())
    .sort("m")