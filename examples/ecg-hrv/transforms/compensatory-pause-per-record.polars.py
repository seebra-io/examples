data.group_by("record")
    .agg(pvcs = len(), median_coupling_ms = col("coupling_ms").median(), median_pause_ms = col("pause_ms").median(),
         nn_median_ms = col("nn_median").first(), median_compensation = col("compensation").median(),
         p10_compensation = col("compensation").quantile(0.1, "linear"), p90_compensation = col("compensation").quantile(0.9, "linear"))
    .with_columns(median_compensation = col("median_compensation").round(3), p10_compensation = col("p10_compensation").round(3), p90_compensation = col("p90_compensation").round(3))
    .sort("pvcs", descending=True)