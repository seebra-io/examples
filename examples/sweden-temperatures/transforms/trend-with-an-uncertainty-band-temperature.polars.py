data.with_columns(n = len().cast(Float64), dx = col("lat") - col("lat").mean(), dy = col("temp") - col("temp").mean())
    .with_columns(sxx = (col("dx") * col("dx")).sum(), slope = (col("dx") * col("dy")).sum() / (col("dx") * col("dx")).sum())
    .with_columns(fit = col("temp").mean() + col("slope") * col("dx"))
    .with_columns(resid = col("temp") - col("fit"))
    .with_columns(s = ((col("resid") * col("resid")).sum() / (col("n") - 2)).sqrt(), tq = t_ppf(0.975, col("n") - 2))
    .with_columns(se_line = col("s") * (1 / col("n") + col("dx") * col("dx") / col("sxx")).sqrt(),
                  se_station = col("s") * (1 + 1 / col("n") + col("dx") * col("dx") / col("sxx")).sqrt(),
                  se_slope = col("s") / col("sxx").sqrt())
    .select("station", "lat", "temp", "height_m", "quality",
            fit = col("fit").round(2),
            lo = (col("fit") - col("tq") * col("se_line")).round(2),
            hi = (col("fit") + col("tq") * col("se_line")).round(2),
            lo_station = (col("fit") - col("tq") * col("se_station")).round(2),
            hi_station = (col("fit") + col("tq") * col("se_station")).round(2),
            resid = col("resid").round(1),
            slope = col("slope").round(2),
            slope_lo = (col("slope") - col("tq") * col("se_slope")).round(2),
            slope_hi = (col("slope") + col("tq") * col("se_slope")).round(2),
            n = col("n").cast(Int64))
    .sort("lat")