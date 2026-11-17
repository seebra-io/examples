# the best lag, the runner-up peak at least 12 h away from it, and what the best lag means
data.filter(col("r_ramp") == col("r_ramp").max())
    .select(best_lag = col("lag"), best_lag_h = col("lag_h"), best_r = col("r_ramp"), pairs = col("n"))
    .join(data.select("lag", "lag_h", "r_ramp", "r_flow"), how="cross")
    .filter((col("lag") - col("best_lag")).abs() > 48)
    .filter(col("r_ramp") == col("r_ramp").max())
    .select("best_lag", "best_lag_h", "best_r", "pairs", runner_up_lag_h = col("lag_h"), runner_up_r = col("r_ramp"))
    .join(data.filter(col("r_flow") == col("r_flow").max()).select(flow_best_lag_h = col("lag_h"), flow_best_r = col("r_flow")), how="cross")
    .with_columns(river_km = lit(140.8),
                  margin = (col("best_r") - col("runner_up_r")).round(4))
    .with_columns(celerity_km_h = (col("river_km") / col("best_lag_h")).round(2),
                  celerity_m_s = (col("river_km") * 1000 / (col("best_lag_h") * 3600)).round(2))