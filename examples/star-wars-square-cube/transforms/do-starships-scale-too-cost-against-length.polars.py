# the same scaling question for machines: cost and crew against length (log-log slopes); 3 would be "price by volume"
data.filter(col("cost").is_not_null() & col("length_m").is_not_null())
    .select(ships_priced = len(),
            cost_slope = (((col("log_len") - col("log_len").mean()) * (col("log_cost") - col("log_cost").mean())).sum() / (col("log_len") - col("log_len").mean()).pow(2).sum()).round(3),
            cost_r = (((col("log_len") - col("log_len").mean()) * (col("log_cost") - col("log_cost").mean())).sum()
                      / ((col("log_len") - col("log_len").mean()).pow(2).sum() * (col("log_cost") - col("log_cost").mean()).pow(2).sum()).sqrt()).round(3),
            cheapest_per_m3 = col("cost_per_m3").min(), dearest_per_m3 = col("cost_per_m3").max(),
            hyperdrive_vs_cost_r = (((col("hyperdrive") - col("hyperdrive").mean()) * (col("log_cost") - col("log_cost").mean())).sum()
                      / ((col("hyperdrive") - col("hyperdrive").mean()).pow(2).sum() * (col("log_cost") - col("log_cost").mean()).pow(2).sum()).sqrt()).round(3))