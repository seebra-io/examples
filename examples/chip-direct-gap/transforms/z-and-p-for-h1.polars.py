# z = (p1 - p2) / sqrt(p(1-p)(1/n1 + 1/n2)), p pooled; one-sided p = 1 - Φ(z).
data.select(n1 = col("n").first(), k1 = col("n_direct").first(), n2 = col("n").last(), k2 = col("n_direct").last())
    .with_columns(p1 = col("k1") / col("n1"), p2 = col("k2") / col("n2"), pool = (col("k1") + col("k2")) / (col("n1") + col("n2")))
    .with_columns(z = (col("p1") - col("p2")) / (col("pool") * (1 - col("pool")) * (1 / col("n1") + 1 / col("n2"))).sqrt())
    .with_columns(p_one_sided = 1 - norm_cdf(col("z")), difference = col("p1") - col("p2"))
    .select(share_iii_v_ii_vi = col("p1").round(3), share_rest = col("p2").round(3), difference = col("difference").round(3),
            z = col("z").round(2), p_one_sided = col("p_one_sided").round(6), n_iii_v_ii_vi = col("n1"), n_rest = col("n2"))