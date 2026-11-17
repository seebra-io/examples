# 150 trial values of the curvature c, from 0.0002 to 0.07 per (kg/ha): half the response is reached at ln 2 / c
data.filter(col("in_fit"))
    .join(data1.rows("1").with_row_index("k").filter(col("k") < 150).select(c = 0.0002 * lit(1.04).pow(col("k").cast(Float64))), how="cross")
    # for a fixed c the model Y = Y0 + A (1 - e^(-c N)) is a straight line in x = 1 - e^(-c N): least squares gives A and Y0 in closed form
    .with_columns(x = 1 - (-col("c") * col("fert_kg_ha")).exp())
    .with_columns(mx = col("x").mean().over("c"), my = col("yield_kg_ha").mean().over("c"))
    .group_by("c")
    .agg(n = len(), sxy = ((col("x") - col("mx")) * (col("yield_kg_ha") - col("my"))).sum(),
         sxx = (col("x") - col("mx")).pow(2).sum(), syy = (col("yield_kg_ha") - col("my")).pow(2).sum(),
         mx = col("mx").first(), my = col("my").first())
    .with_columns(A = col("sxy") / col("sxx"))
    .with_columns(Y0 = col("my") - col("A") * col("mx"), sse = col("syy") - col("sxy").pow(2) / col("sxx"))
    .with_columns(r2 = 1 - col("sse") / col("syy"), half_n = 0.6931471805599453 / col("c"))
    # profile likelihood: c values whose fit is within chi-square(1) = 3.84 of the best are its 95% interval
    .with_columns(dev = col("n").cast(Float64) * (col("sse") / col("sse").min()).log())
    .with_columns(in_ci = col("dev") <= 3.841,
                  c = col("c").round(6), A = col("A").round(1), Y0 = col("Y0").round(1), r2 = col("r2").round(4),
                  half_n = col("half_n").round(1), dev = col("dev").round(2))
    .select("c", "half_n", "A", "Y0", "sse", "r2", "dev", "in_ci", "n")
    .sort("c")