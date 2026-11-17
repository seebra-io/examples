# the rating shift: the median residual per decade, at low flows (the bed controls) and at floods (the channel and floodplain control)
data.group_by("decade", "flow_class")
    .agg(measurements = len(), median_res_log = col("res_log").median(),
         q25_log = col("res_log").quantile(0.25, "linear"), q75_log = col("res_log").quantile(0.75, "linear"))
    .filter(col("measurements") >= 10)
    .with_columns(median_res_pct = (100 * (col("median_res_log").exp() - 1)).round(1),
                  q25_pct = (100 * (col("q25_log").exp() - 1)).round(1), q75_pct = (100 * (col("q75_log").exp() - 1)).round(1))
    .select("decade", "flow_class", "measurements", "median_res_pct", "q25_pct", "q75_pct")
    .sort("flow_class", "decade")