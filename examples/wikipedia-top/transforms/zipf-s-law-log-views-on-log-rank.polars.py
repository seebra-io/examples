data.with_columns(lr = col("rank").cast(Float64).log(), lv = col("views").cast(Float64).log())
    .with_columns(slope = ((col("lr") * col("lv")).mean() - col("lr").mean() * col("lv").mean())
                          / ((col("lr") * col("lr")).mean() - col("lr").mean() * col("lr").mean()))
    .with_columns(icept = col("lv").mean() - col("slope") * col("lr").mean())
    .with_columns(fitted = (col("icept") + col("slope") * col("lr")).exp().round(0),
                  zipf_s = (-col("slope")).round(2))
    .with_columns(ratio = (col("views") / col("fitted")).round(2))
    .select("rank", "article", "views", "fitted", "ratio", "zipf_s", "link")