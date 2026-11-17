# Where the law fails: each age's observed death rate against the fitted
# Gompertz line, as a ratio (1 = on the line). Childhood (falling risk after
# birth), the young-adult "accident hump" (ages 15–30, mostly men: road
# deaths, suicide), and the oldest ages (the rise slows: mortality
# deceleration, and selection of the frailest) all lie off it.
data.join(data1.select("geo", "sex", "year", "b", "ln_a"), on=["geo", "sex", "year"])
    .with_columns(fitted = (col("ln_a") + col("b") * col("age")).exp())
    .with_columns(ratio = (col("mx") / col("fitted")).round(3), fitted = col("fitted").round(6),
                  phase = when(col("age") < 15).then(lit("childhood")).when(col("age") < 35).then(lit("young adult"))
                          .when(col("age") <= 84).then(lit("fitted range 35–84")).otherwise(lit("oldest")))
    .select("geo", "country", "sex", "year", "age", "open_age", "mx", "fitted", "ratio", "phase", "link")