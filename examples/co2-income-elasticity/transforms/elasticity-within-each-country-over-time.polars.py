data.with_columns(x = col("gdp_ppp").log(), y = col("co2_t").log())
    .with_columns(mx = col("x").mean().over("country"), my = col("y").mean().over("country"))
    .group_by("country")
    .agg(years = len(), first_year = col("year").min(), last_year = col("year").max(),
         sxx = ((col("x") - col("mx")).pow(2)).sum(), sxy = ((col("x") - col("mx")) * (col("y") - col("my"))).sum(),
         syy = ((col("y") - col("my")).pow(2)).sum(),
         gdp_first = col("gdp_ppp").first(), gdp_last = col("gdp_ppp").last(), co2_first = col("co2_t").first(), co2_last = col("co2_t").last())
    .with_columns(elasticity = col("sxy") / col("sxx"))
    .with_columns(se = ((col("syy") - col("elasticity") * col("sxy")) / (col("years") - 2) / col("sxx")).sqrt())
    .with_columns(lo = (col("elasticity") - t_ppf(0.975, col("years") - 2) * col("se")).round(2),
                  hi = (col("elasticity") + t_ppf(0.975, col("years") - 2) * col("se")).round(2),
                  elasticity = col("elasticity").round(2),
                  gdp_change = (col("gdp_last") / col("gdp_first") - 1).round(3),
                  co2_change = (col("co2_last") / col("co2_first") - 1).round(3))
    .select("country", "first_year", "last_year", "years", "elasticity", "lo", "hi", "gdp_change", "co2_change")
    .sort("elasticity")