data.group_by("minute").agg(events = len(), objects = col("object").n_unique())
    .with_columns(span = col("minute").max() - col("minute").min() + 1, total = col("events").sum())
    .with_columns(rate = col("total") / col("span"))
    .with_columns(dispersion = ((col("events") * col("events")).sum() / col("span") - col("rate") * col("rate")) / col("rate"),
                  p = gamma_cdf(col("rate"), col("events").cast(Float64), 1))
    .with_columns(burst = col("p") * col("span") < 0.05)
    .sort("minute")