# data1: the x_min scan. The tail fit (best x_min) starts at the observed P(K ≥ x_min); the whole-range fit uses α at x_min = 1.
data.join(data1.filter(col("ks") == col("ks").min()).select(xmin = col("xmin"), alpha = col("alpha")), how="cross")
    .join(data1.filter(col("xmin") == 1).select(alpha_1 = col("alpha")), how="cross")
    .with_columns(mean_k = col("links").sum().over("network") / col("n").sum().over("network"),
                  s_xmin = when(col("k") == col("xmin")).then(col("ccdf")).otherwise(0.0).max().over("network"),
                  advisors_net = col("network") == "students per advisor")
    .with_columns(q = 1 - 1 / col("mean_k"))
    .with_columns(ccdf_tail = when(col("advisors_net") & (col("k") >= col("xmin"))).then(col("s_xmin") * ((col("k") - 0.5) / (col("xmin") - 0.5)).pow(1 - col("alpha"))),
                  share_tail = when(col("advisors_net") & (col("k") >= col("xmin"))).then(col("s_xmin") * (((col("k") - 0.5) / (col("xmin") - 0.5)).pow(1 - col("alpha")) - ((col("k") + 0.5) / (col("xmin") - 0.5)).pow(1 - col("alpha")))),
                  ccdf_all = when(col("advisors_net")).then(((col("k") - 0.5) / 0.5).pow(1 - col("alpha_1"))),
                  # thin-tailed reference: a geometric distribution on 1, 2, 3, … with the network's own mean
                  ccdf_geo = col("q").pow(col("k") - 1))
    .with_columns(expected_geo = col("ccdf_geo") * col("total"), observed_at_least = (col("ccdf") * col("total")).round(0),
                  log_k = col("k").cast(Float64).log(10), log_ccdf = col("ccdf").log(10))
    .select("network", "k", "n", "share", "ccdf", "log_k", "log_ccdf", "ccdf_tail", "share_tail", "ccdf_all", "ccdf_geo", "expected_geo", "observed_at_least", "mean_k", "xmin", "alpha", "alpha_1", "link")
    .sort("network", "k")