# Each fit's degrees k ≥ x_min modelled two ways, both as probabilities of exactly k:
#   power law, MLE α:  P(k) = ((k − ½)/(x_min − ½))^(1−α) − ((k + ½)/(x_min − ½))^(1−α)
#   exponential (geometric) with the same mean: P(k) = (1 − e^(−λ)) e^(−λ (k − x_min)), λ = ln(1 + 1/(mean − x_min))
# R = Σ n (ln P_pl − ln P_exp): R > 0 favours the power law; z = R / (√N σ) and p = 2 Φ(−|z|) say whether the sign can be trusted.
data.filter(col("k") >= col("xmin"))
    .with_columns(n_tail = col("n").sum().over("fit"),
                  mean_tail = col("links").sum().over("fit") / col("n").sum().over("fit"),
                  s_log = (col("n") * (col("k") / (col("xmin") - 0.5)).log()).sum().over("fit"))
    .with_columns(alpha = 1 + col("n_tail") / col("s_log"),
                  lam = (1 + 1 / (col("mean_tail") - col("xmin"))).log())
    .with_columns(l_pl = (((col("k") - 0.5) / (col("xmin") - 0.5)).pow(1 - col("alpha")) - ((col("k") + 0.5) / (col("xmin") - 0.5)).pow(1 - col("alpha"))).log(),
                  l_exp = (1 - (-col("lam")).exp()).log() - col("lam") * (col("k") - col("xmin")))
    .with_columns(d = col("l_pl") - col("l_exp"))
    .with_columns(dbar = (col("n") * col("d")).sum().over("fit") / col("n_tail"))
    .group_by("fit")
    .agg(network = col("network").first(), xmin = col("xmin").first(), n_tail = col("n_tail").first(), mean_tail = col("mean_tail").first(),
         alpha = col("alpha").first(), lam = col("lam").first(),
         R = (col("n") * col("d")).sum(), sd = ((col("n") * (col("d") - col("dbar")).pow(2)).sum() / col("n_tail").first()).sqrt())
    .with_columns(z = col("R") / (col("n_tail").cast(Float64).sqrt() * col("sd")))
    .with_columns(p_value = (2 * norm_cdf(-col("z").abs())).round(4),
                  verdict = when(col("z") > 2).then(lit("power law fits better")).when(col("z") < -2).then(lit("exponential fits better")).otherwise(lit("can't tell them apart")))
    .with_columns(alpha = col("alpha").round(3), lam = col("lam").round(4), mean_tail = col("mean_tail").round(3), R = col("R").round(1), sd = col("sd").round(4), z = col("z").round(2))
    .select("fit", "network", "xmin", "n_tail", "mean_tail", "alpha", "lam", "R", "z", "p_value", "verdict")
    .sort("network", "xmin")