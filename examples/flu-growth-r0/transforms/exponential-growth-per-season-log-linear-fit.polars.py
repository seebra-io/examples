# The epidemic's early growth, per season. The peak: the week of highest
# ILI+. The growth window: weeks before the peak with ILI+ between 5% and
# 60% of the peak, where an epidemic in a mostly susceptible population
# grows exponentially, I(t) ≈ I0 · e^(r t). r is the slope of ln(ILI+)
# on t (least squares, per week), with the fit's R² and the window's
# weeks. Seasons whose peak ILI+ stays under 0.3% (2020–21 and 2021–22,
# when COVID measures held influenza down) are left out.
data.filter(col("ili_plus") > 0)
    .with_columns(peak = col("ili_plus").max().over("season"))
    .with_columns(peak_t = when(col("ili_plus") == col("peak")).then(col("t")).min().over("season"))
    .filter((col("t") <= col("peak_t")) & (col("ili_plus") >= 0.05 * col("peak")) & (col("ili_plus") <= 0.6 * col("peak")) & (col("peak") >= 0.3))
    .with_columns(y = col("ili_plus").log())
    .group_by("season", "season_start", "peak", "peak_t")
    .agg(weeks = len(), t0 = col("t").min(), t1 = col("t").max(),
         mt = col("t").mean(), my = col("y").mean(),
         stt = ((col("t") - col("t").mean()).pow(2)).sum(),
         sty = ((col("t") - col("t").mean()) * (col("y") - col("y").mean())).sum(),
         syy = ((col("y") - col("y").mean()).pow(2)).sum())
    .filter(col("weeks") >= 3)
    .with_columns(r_week = col("sty") / col("stt"))
    .with_columns(intercept = col("my") - col("r_week") * col("mt"),
                  fit_r2 = (col("sty").pow(2) / (col("stt") * col("syy"))).round(3))
    .select("season", "season_start", "peak", "peak_t", "weeks", "t0", "t1", "r_week", "intercept", "fit_r2")
    .sort("season_start")