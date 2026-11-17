# 1) a straight line through the log-log histogram, every degree weighted equally: slope = −α (biased)
# 2) the same through the log-log CCDF: slope = 1 − α (less noisy, still not a likelihood fit)
data.with_columns(mx = col("log_k").mean(), my = col("log_share").mean(), mc = col("log_ccdf").mean())
    .select(points = len(),
            slope_hist = ((col("log_k") - col("mx")) * (col("log_share") - col("my"))).sum() / (col("log_k") - col("mx")).pow(2).sum(),
            slope_ccdf = ((col("log_k") - col("mx")) * (col("log_ccdf") - col("mc"))).sum() / (col("log_k") - col("mx")).pow(2).sum(),
            # degrees seen by one advisor only: the noise floor of the histogram's tail
            intercept_hist = col("my").first() - col("mx").first() * ((col("log_k") - col("mx")) * (col("log_share") - col("my"))).sum() / (col("log_k") - col("mx")).pow(2).sum(),
            floor_points = when(col("n") == 1).then(1).otherwise(0).sum())
    .with_columns(alpha_hist = (-col("slope_hist")).round(3), alpha_ccdf = (1 - col("slope_ccdf")).round(3),
                  slope_hist = col("slope_hist").round(4), slope_ccdf = col("slope_ccdf").round(4), intercept_hist = col("intercept_hist").round(4))