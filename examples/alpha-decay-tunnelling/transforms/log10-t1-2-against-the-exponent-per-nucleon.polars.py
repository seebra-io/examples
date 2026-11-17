data.with_columns(mx = col("gamow_log10").mean().over("parity"), my = col("log_t").mean().over("parity"))
    .with_columns(b = (((col("gamow_log10") - col("mx")) * (col("log_t") - col("my"))).sum() / (col("gamow_log10") - col("mx")).pow(2).sum()).over("parity"))
    .with_columns(res = col("log_t") - col("my") - col("b") * (col("gamow_log10") - col("mx")),
                  off = col("log_t") - col("gamow_log10"))
    .group_by("parity")
    .agg(nuclides = len(), slope = col("b").first(), intercept = (col("my") - col("b") * col("mx")).first(),
         residual_sd_dex = col("res").std(), r = (1 - col("res").pow(2).sum() / (col("log_t") - col("my")).pow(2).sum()).sqrt(),
         slope1_constant = col("off").mean(), shortest_s = col("half_life_s").min(), longest_s = col("half_life_s").max(),
         decades = col("log_t").max() - col("log_t").min())
    .with_columns(slope = col("slope").round(3), intercept = col("intercept").round(2), residual_sd_dex = col("residual_sd_dex").round(2), r = col("r").round(4),
                  slope1_constant = col("slope1_constant").round(2), decades = col("decades").round(1))
    .sort("nuclides", descending=True)