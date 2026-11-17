# Clauset, Shalizi & Newman (2009): for each candidate x_min, fit the tail k ≥ x_min by maximum likelihood
# (discrete approximation α = 1 + n / Σ ln(k / (x_min − ½)), each degree weighted by how many advisors have it),
# then measure the largest gap (KS distance) between the tail's empirical CCDF and the fitted one.
data.filter(col("k") <= 40).select(xmin = col("k"))
    .join(data.select("k", "n"), how="cross")
    .filter(col("k") >= col("xmin"))
    .sort("xmin", "k")
    .with_columns(n_tail = col("n").sum().over("xmin"),
                  s_log = (col("n") * (col("k") / (col("xmin") - 0.5)).log()).sum().over("xmin"))
    .with_columns(alpha = 1 + col("n_tail") / col("s_log"))
    .with_columns(emp = col("n").cum_sum(reverse=True).over("xmin") / col("n_tail"),
                  model = ((col("k") - 0.5) / (col("xmin") - 0.5)).pow(1 - col("alpha")))
    .with_columns(gap = (col("emp") - col("model")).abs())
    .group_by("xmin")
    .agg(alpha = col("alpha").first(), n_tail = col("n_tail").first(), ks = col("gap").max(), distinct_k = len())
    .with_columns(se_alpha = ((col("alpha") - 1) / col("n_tail").cast(Float64).sqrt()).round(4), alpha = col("alpha").round(4), ks = col("ks").round(5),
                  # a KS distance this small is what sampling noise alone gives for n_tail values (≈ 1/√n)
                  ks_noise = (1 / col("n_tail").cast(Float64).sqrt()).round(5))
    .sort("xmin")