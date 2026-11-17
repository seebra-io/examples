# the floods foot by foot: at the top of the curve the same stage carries very different flows
data.filter(col("stage_ft") >= 28)
    .with_columns(stage_band_ft = col("stage_ft").floor())
    .group_by("stage_band_ft")
    .agg(measurements = len(), min_cfs = col("discharge_cfs").min(), max_cfs = col("discharge_cfs").max(),
         median_cfs = col("discharge_cfs").median(), curve_cfs = col("q_curve").median(), median_res_pct = col("res_pct").median(),
         first_year = col("year").min(), last_year = col("year").max())
    .with_columns(max_over_min = (col("max_cfs") / col("min_cfs")).round(2))
    .sort("stage_band_ft")