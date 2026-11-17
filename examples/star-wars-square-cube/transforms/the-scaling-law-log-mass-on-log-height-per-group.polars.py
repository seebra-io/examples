# log10 mass = a + b log10 height, least squares per group. b = 3 is the square-cube law (a scaled-up body),
# b = 2 is what Quetelet found for adult humans (so mass / height² , the BMI, doesn't depend on height)
data.group_by("grp")
    .agg(n = len(), mx = col("x").mean(), my = col("y").mean(),
         sxy = ((col("x") - col("x").mean()) * (col("y") - col("y").mean())).sum(),
         sxx = (col("x") - col("x").mean()).pow(2).sum(),
         syy = (col("y") - col("y").mean()).pow(2).sum())
    .with_columns(slope = col("sxy") / col("sxx"))
    .with_columns(intercept = col("my") - col("slope") * col("mx"),
                  se = ((col("syy") - col("sxy").pow(2) / col("sxx")) / (col("n") - 2) / col("sxx")).sqrt(),
                  r2 = col("sxy").pow(2) / (col("sxx") * col("syy")))
    .select("grp", "n", slope = col("slope").round(3), se = col("se").round(3),
            lo95 = (col("slope") - 2 * col("se")).round(2), hi95 = (col("slope") + 2 * col("se")).round(2),
            t_vs_bmi_2 = ((col("slope") - 2) / col("se")).round(1), t_vs_cube_3 = ((col("slope") - 3) / col("se")).round(1),
            r2 = col("r2").round(3), intercept = col("intercept").round(4),
            # how much heavier a character twice as tall is: 2^b (8× for a cube, 4× for BMI)
            twice_as_tall_weighs = lit(2.0).pow(col("slope")).round(2))
    .sort("n", descending=True)