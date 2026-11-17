# Fisher's linear discriminant for tetrahedral (class 1) against octahedral (0)
# on x = Δχ and y = n̄: w = S⁻¹ (μ1 − μ0), S the pooled within-class covariance,
# boundary w·(x, y) = w·(μ0 + μ1)/2 (equal priors). As a line in the plane:
# n̄ = intercept + slope · Δχ. The 2 × 2 inverse is written out.
data.filter(col("coordination").is_in(["tetrahedral (4)", "octahedral (6)"]))
    .with_columns(c = (col("coordination") == "tetrahedral (4)").cast(Int64), x = col("delta_chi"), y = col("n_bar"))
    .with_columns(dx = col("x") - col("x").mean().over("c"), dy = col("y") - col("y").mean().over("c"))
    .select(n = len(), n1 = col("c").sum(),
            mx1 = when(col("c") == 1).then(col("x")).otherwise(None).mean(), my1 = when(col("c") == 1).then(col("y")).otherwise(None).mean(),
            mx0 = when(col("c") == 0).then(col("x")).otherwise(None).mean(), my0 = when(col("c") == 0).then(col("y")).otherwise(None).mean(),
            sxx = (col("dx") * col("dx")).sum(), sxy = (col("dx") * col("dy")).sum(), syy = (col("dy") * col("dy")).sum())
    .with_columns(det = col("sxx") * col("syy") - col("sxy").pow(2))
    .with_columns(wx = (col("syy") * (col("mx1") - col("mx0")) - col("sxy") * (col("my1") - col("my0"))) / col("det"),
                  wy = (col("sxx") * (col("my1") - col("my0")) - col("sxy") * (col("mx1") - col("mx0"))) / col("det"))
    .with_columns(b = col("wx") * (col("mx0") + col("mx1")) / 2 + col("wy") * (col("my0") + col("my1")) / 2)
    .with_columns(slope = -col("wx") / col("wy"), intercept = col("b") / col("wy"))
    .select("n", "n1", "wx", "wy", "b", slope = col("slope").round(3), intercept = col("intercept").round(3),
            mean_dchi_tetra = col("mx1").round(3), mean_dchi_octa = col("mx0").round(3), mean_nbar_tetra = col("my1").round(3), mean_nbar_octa = col("my0").round(3))