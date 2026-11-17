# Each measure split at the break year the clock data chose (breaks: best), and
# a least-squares line of log2(value) on year in each era:
#   slope = doublings per year, doubling_years = 1 / slope (none when flat:
#   every processor before the break had one core),
#   growth_pct = (2^slope - 1) * 100, r2 = the share of variance the line explains.
# Also the whole 50 years in one line (era 'all'), for the Chow test.
data.join(data1.filter(col("best")).select("brk").head(1), how="cross")
    .with_columns(era = when(col("year") < col("brk")).then(concat_str([lit("before "), col("brk").cast(String)])).otherwise(concat_str([col("brk").cast(String), lit(" on")])))
    .group_by("series", "measure", "unit", "era", "brk")
    .agg(n = len(), year_from = col("year").min(), year_to = col("year").max(),
         mx = col("year").mean(), my = col("log2_value").mean(),
         sxx = (col("year") - col("year").mean()).pow(2).sum(),
         sxy = ((col("year") - col("year").mean()) * (col("log2_value") - col("log2_value").mean())).sum(),
         syy = (col("log2_value") - col("log2_value").mean()).pow(2).sum())
    .with_columns(slope = col("sxy") / col("sxx"))
    .with_columns(intercept = col("my") - col("slope") * col("mx"),
                  sse = col("syy") - col("sxy").pow(2) / col("sxx"),
                  r2 = when(col("syy") > 0).then(col("sxy").pow(2) / (col("sxx") * col("syy"))).otherwise(None),
                  doubling_years = when(col("slope").abs() > 1e-6).then(1 / col("slope")).otherwise(None),
                  growth_pct = ((col("slope") * 0.6931471805599453).exp() - 1) * 100,
                  se_slope = ((col("syy") - col("sxy").pow(2) / col("sxx")) / (col("n") - 2) / col("sxx")).sqrt())
    .with_columns(slope_lo = col("slope") - t_ppf(0.975, col("n") - 2) * col("se_slope"),
                  slope_hi = col("slope") + t_ppf(0.975, col("n") - 2) * col("se_slope"))
    .select("series", "measure", "unit", "era", "brk", "n", year_from = col("year_from").round(1), year_to = col("year_to").round(1),
            slope = col("slope").round(4), slope_lo = col("slope_lo").round(4), slope_hi = col("slope_hi").round(4),
            intercept = col("intercept").round(3), doubling_years = col("doubling_years").round(2),
            growth_pct = col("growth_pct").round(1), r2 = col("r2").round(3), sse = col("sse").round(3))
    .sort("series", "era")