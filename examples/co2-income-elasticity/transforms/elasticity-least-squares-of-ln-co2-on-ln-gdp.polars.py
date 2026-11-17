data.with_columns(n = len(), mx = col("ln_gdp").mean(), my = col("ln_co2").mean())
    .with_columns(sxx = ((col("ln_gdp") - col("mx")).pow(2)).sum(), sxy = ((col("ln_gdp") - col("mx")) * (col("ln_co2") - col("my"))).sum(),
                  syy = ((col("ln_co2") - col("my")).pow(2)).sum())
    .with_columns(elasticity = col("sxy") / col("sxx"))
    .with_columns(fitted_ln = col("my") + col("elasticity") * (col("ln_gdp") - col("mx")))
    .with_columns(residual = col("ln_co2") - col("fitted_ln"))
    .with_columns(se = ((col("residual").pow(2)).sum() / (col("n") - 2) / col("sxx")).sqrt(),
                  r2 = col("sxy").pow(2) / (col("sxx") * col("syy")))
    .with_columns(lo = col("elasticity") - t_ppf(0.975, col("n") - 2) * col("se"),
                  hi = col("elasticity") + t_ppf(0.975, col("n") - 2) * col("se"),
                  fitted_t = col("fitted_ln").exp().round(2),
                  times_the_fit = col("residual").exp().round(2))
    .select("country", "iso3", "region", "income", "gdp_ppp", "co2_t", "population", "co2_year", "gdp_year", "fitted_t", "times_the_fit", "link",
            elasticity = col("elasticity").round(3), lo = col("lo").round(3), hi = col("hi").round(3), r2 = col("r2").round(3), n = col("n"))
    .sort("times_the_fit", descending=True)