data.with_columns(mx1 = col("log_a").mean(), my1 = col("log_p").mean(), mx2 = col("log_a3_m").mean(), my2 = col("log_p2").mean())
    .with_columns(sxy1 = ((col("log_a") - col("mx1")) * (col("log_p") - col("my1"))).sum(), sxx1 = (col("log_a") - col("mx1")).pow(2).sum(),
                  sxy2 = ((col("log_a3_m") - col("mx2")) * (col("log_p2") - col("my2"))).sum(), sxx2 = (col("log_a3_m") - col("mx2")).pow(2).sum(),
                  syy1 = (col("log_p") - col("my1")).pow(2).sum(), syy2 = (col("log_p2") - col("my2")).pow(2).sum())
    .with_columns(slope_raw = col("sxy1") / col("sxx1"), slope_norm = col("sxy2") / col("sxx2"))
    .with_columns(res1 = col("log_p") - col("my1") - col("slope_raw") * (col("log_a") - col("mx1")),
                  res2 = col("log_p2") - col("my2") - col("slope_norm") * (col("log_a3_m") - col("mx2")))
    .select(planets = len(),
            slope_P_on_a = col("slope_raw").first(), expected_P_on_a = lit(1.5),
            se_P_on_a = ((col("res1").pow(2).sum() / (len() - 2)) / col("sxx1").first()).sqrt(),
            r2_P_on_a = 1 - col("res1").pow(2).sum() / col("syy1").first(),
            slope_P2_on_a3_M = col("slope_norm").first(), expected_P2_on_a3_M = lit(1.0),
            se_P2_on_a3_M = ((col("res2").pow(2).sum() / (len() - 2)) / col("sxx2").first()).sqrt(),
            r2_P2_on_a3_M = 1 - col("res2").pow(2).sum() / col("syy2").first(),
            intercept_P2 = (col("my2") - col("slope_norm") * col("mx2")).first(),
            scatter_dex = col("log_ratio").std(),
            share_consistent = (col("log_ratio").abs() < 0.0043).cast(Float64).mean(),
            decades_in_period = (col("period_days").max() / col("period_days").min()).log(10))
    .with_columns(slope_P_on_a = col("slope_P_on_a").round(4), se_P_on_a = col("se_P_on_a").round(4), r2_P_on_a = col("r2_P_on_a").round(4),
                  slope_P2_on_a3_M = col("slope_P2_on_a3_M").round(4), se_P2_on_a3_M = col("se_P2_on_a3_M").round(4), r2_P2_on_a3_M = col("r2_P2_on_a3_M").round(5),
                  intercept_P2 = col("intercept_P2").round(4), scatter_dex = col("scatter_dex").round(4), share_consistent = col("share_consistent").round(3),
                  decades_in_period = col("decades_in_period").round(1))