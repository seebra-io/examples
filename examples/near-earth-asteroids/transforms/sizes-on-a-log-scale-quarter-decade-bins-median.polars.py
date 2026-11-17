data.with_columns(log10_size = col("size_m").log(10))
    .with_columns(median_m = col("size_m").median().round(0),
                  mean_m = col("size_m").mean().round(0),
                  geo_mean_m = (col("log10_size").mean() * 2.302585).exp().round(0),
                  objects = len(),
                  bin = (col("log10_size") * 4).floor() / 4)
    .group_by("bin")
    .agg(n = len(), hazardous = col("hazardous").cast(Int64).sum(), smallest_m = col("size_m").min(), largest_m = col("size_m").max(),
         median_m = col("median_m").first(), mean_m = col("mean_m").first(), geo_mean_m = col("geo_mean_m").first(), objects = col("objects").first())
    .with_columns(from_m = (col("bin") * 2.302585).exp().round(1), to_m = ((col("bin") + 0.25) * 2.302585).exp().round(1))
    .sort("bin")