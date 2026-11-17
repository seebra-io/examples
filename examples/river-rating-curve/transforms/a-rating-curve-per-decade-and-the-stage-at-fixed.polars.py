# Q = C (h - e)^b is a straight line in log space for a given e: ln Q = ln C + b ln(h - e).
# Try every e on a grid (cross join), fit b and C by least squares for each, keep the e with the smallest error.
data.join(data.with_row_index("k").filter(col("k") < 233).select(e = -30.0 + col("k").cast(Float64) * 0.125), how="cross")
    .filter(col("stage_ft") > col("e"))
    .with_columns(x = (col("stage_ft") - col("e")).log(), y = col("discharge_cfs").log())
    .group_by("decade", "e")
    .agg(n = len(), sx = col("x").sum(), sy = col("y").sum(), sxx = (col("x") * col("x")).sum(),
         sxy = (col("x") * col("y")).sum(), syy = (col("y") * col("y")).sum(),
         min_stage = col("stage_ft").min(), max_stage = col("stage_ft").max(),
         min_q = col("discharge_cfs").min(), max_q = col("discharge_cfs").max(),
         first_year = col("year").min(), last_year = col("year").max())
    # only the e values below every measured stage (all measurements in the fit)
    .filter(col("n") == col("n").max().over("decade"))
    .with_columns(sxxc = col("sxx") - col("sx") * col("sx") / col("n"), sxyc = col("sxy") - col("sx") * col("sy") / col("n"),
                  syyc = col("syy") - col("sy") * col("sy") / col("n"))
    .with_columns(b = col("sxyc") / col("sxxc"))
    .with_columns(sse = col("syyc") - col("b") * col("sxyc"), C = ((col("sy") - col("b") * col("sx")) / col("n")).exp())
    # profile likelihood: the e values whose fit is within chi-square(1) 3.84 of the best are a 95% interval for e
    .with_columns(sse_min = col("sse").min().over("decade"))
    .with_columns(in_ci = col("n") * (col("sse") / col("sse_min")).log() <= 3.84)
    .filter(col("n") >= 100)
    .filter(col("sse") == col("sse").min().over("decade"))
    .with_columns(sigma = (col("sse") / (col("n") - 2)).sqrt())
    # the stage this decade's curve gives for three fixed flows: h = e + (Q / C)^(1/b)
    .with_columns(stage_at_40k = col("e") + (40000.0 / col("C")).pow(1 / col("b")),
                  stage_at_100k = col("e") + (100000.0 / col("C")).pow(1 / col("b")),
                  stage_at_300k = col("e") + (300000.0 / col("C")).pow(1 / col("b")))
    .select(era = concat_str([col("decade").cast(String), lit("s")]), decade = col("decade"), measurements = col("n"),
            e = col("e"), b = col("b").round(3), C = col("C").round(3), sigma_log = col("sigma").round(4),
            stage_at_40k = col("stage_at_40k").round(2), stage_at_100k = col("stage_at_100k").round(2), stage_at_300k = col("stage_at_300k").round(2),
            min_stage = col("min_stage"), max_stage = col("max_stage"), min_q = col("min_q"), max_q = col("max_q"))
    .sort("decade")