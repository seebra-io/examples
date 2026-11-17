# Q = C (h - e)^b is a straight line in log space for a given e: ln Q = ln C + b ln(h - e).
# Try every e on a grid (cross join), fit b and C by least squares for each, keep the e with the smallest error.
data.join(data.with_row_index("k").filter(col("k") < 233).select(e = -30.0 + col("k").cast(Float64) * 0.125), how="cross")
    .filter(col("stage_ft") > col("e"))
    .with_columns(x = (col("stage_ft") - col("e")).log(), y = col("discharge_cfs").log())
    .group_by("e")
    .agg(n = len(), sx = col("x").sum(), sy = col("y").sum(), sxx = (col("x") * col("x")).sum(),
         sxy = (col("x") * col("y")).sum(), syy = (col("y") * col("y")).sum(),
         min_stage = col("stage_ft").min(), max_stage = col("stage_ft").max(),
         min_q = col("discharge_cfs").min(), max_q = col("discharge_cfs").max(),
         first_year = col("year").min(), last_year = col("year").max())
    # only the e values below every measured stage (all measurements in the fit)
    .filter(col("n") == col("n").max())
    .with_columns(sxxc = col("sxx") - col("sx") * col("sx") / col("n"), sxyc = col("sxy") - col("sx") * col("sy") / col("n"),
                  syyc = col("syy") - col("sy") * col("sy") / col("n"))
    .with_columns(b = col("sxyc") / col("sxxc"))
    .with_columns(sse = col("syyc") - col("b") * col("sxyc"), C = ((col("sy") - col("b") * col("sx")) / col("n")).exp())
    # profile likelihood: the e values whose fit is within chi-square(1) 3.84 of the best are a 95% interval for e
    .with_columns(sse_min = col("sse").min())
    .with_columns(in_ci = col("n") * (col("sse") / col("sse_min")).log() <= 3.84)
    .with_columns(e_lo = when(col("in_ci")).then(col("e")).min(), e_hi = when(col("in_ci")).then(col("e")).max())
    .with_columns(b_lo = when(col("e") == col("e_lo")).then(col("b")).max(), C_lo = when(col("e") == col("e_lo")).then(col("C")).max(),
                  b_hi = when(col("e") == col("e_hi")).then(col("b")).max(), C_hi = when(col("e") == col("e_hi")).then(col("C")).max())
    .sort("sse")
    .head(1)
    .with_columns(sigma = (col("sse") / (col("n") - 2)).sqrt())
    .with_columns(se_b = col("sigma") / col("sxxc").sqrt(), r2 = 1 - col("sse") / col("syyc"),
                  band95_pct = 100 * ((1.96 * col("sigma")).exp() - 1))
    .select(era = lit("all years"), measurements = col("n"), e = col("e"), b = col("b").round(3), C = col("C").round(3),
            se_b = col("se_b").round(4), e_lo = col("e_lo"), e_hi = col("e_hi"), b_lo = col("b_lo").round(3), b_hi = col("b_hi").round(3),
            C_lo = col("C_lo").round(3), C_hi = col("C_hi").round(3), sigma_log = col("sigma").round(4), r2 = col("r2").round(4),
            band95_pct = col("band95_pct").round(1), min_stage = col("min_stage"), max_stage = col("max_stage"),
            min_q = col("min_q"), max_q = col("max_q"), first_year = col("first_year"), last_year = col("last_year"))