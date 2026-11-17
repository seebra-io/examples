data.filter(col("cycle") >= 1)
    .sort("smoothed", descending=True, nulls_last=True)
    .group_by("cycle")
    .agg(start = col("t").min(), months = len(), peak_smoothed = col("smoothed").first(), peak_t = col("t").first(), peak_monthly = col("ssn").max())
    .with_columns(length_yr = (col("months").cast(Float64) / 12).round(2), rise_yr = (col("peak_t") - col("start")).round(2),
                  complete = col("cycle") < col("cycle").max(),
                  start = col("start").round(2), peak_t = col("peak_t").round(2))
    .with_columns(link = concat_str([lit("https://en.wikipedia.org/wiki/Solar_cycle_"), col("cycle").cast(String)]))
    .sort("cycle")