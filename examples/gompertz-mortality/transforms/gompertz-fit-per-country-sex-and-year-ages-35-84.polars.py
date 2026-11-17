# Gompertz's law, m(x) = a · e^(b x): ln m(x) is a straight line in age.
# Fitted per country, sex and year by least squares on ages 35–84 (adult
# ages, before the open age group and the oldest ages where the rise slows).
# b: the rate of ageing (per year of age); MRDT = ln 2 / b, the mortality
# rate doubling time in years; a: the level (the death rate the line gives
# at age 0, its intercept, which no real newborn has); m(60) on the line;
# R² of the fit.
data.filter((col("age") >= 35) & (col("age") <= 84) & col("open_age").not_())
    .group_by("geo", "country", "sex", "year")
    .agg(ages = len(), mx_ = col("age").mean(), my = col("ln_mx").mean(),
         sxx = ((col("age") - col("age").mean()).pow(2)).sum(),
         sxy = ((col("age") - col("age").mean()) * (col("ln_mx") - col("ln_mx").mean())).sum(),
         syy = ((col("ln_mx") - col("ln_mx").mean()).pow(2)).sum())
    .with_columns(b = col("sxy") / col("sxx"))
    .with_columns(ln_a = col("my") - col("b") * col("mx_"), r2 = col("sxy").pow(2) / (col("sxx") * col("syy")))
    .with_columns(mrdt = 0.6931471805599453 / col("b"), m60 = (col("ln_a") + 60 * col("b")).exp())
    .with_columns(b = col("b").round(4), ln_a = col("ln_a").round(3), mrdt = col("mrdt").round(2), m60 = col("m60").round(5), r2 = col("r2").round(4))
    .select("geo", "country", "sex", "year", "ages", "b", "mrdt", "ln_a", "m60", "r2")
    .sort("year", "sex", "mrdt")