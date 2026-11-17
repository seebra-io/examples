data.with_columns(total = col("n").sum().over("quantity"))
    .with_columns(share = col("n") / col("total"),
                  benford = (1 + 1 / col("digit").cast(Float64)).log(10))
    .with_columns(expected = col("benford") * col("total"),
                  sd_share = (col("benford") * (1 - col("benford")) / col("total")).sqrt())
    .with_columns(lo = col("benford") - 1.96 * col("sd_share"), hi = col("benford") + 1.96 * col("sd_share"),
                  chi2_part = (col("n") - col("expected")).pow(2) / col("expected"))
    .with_columns(chi2 = col("chi2_part").sum().over("quantity"),
                  mad = (col("share") - col("benford")).abs().mean().over("quantity"),
                  mad_by_chance = (0.7978845608 * col("sd_share")).mean().over("quantity"))
    .with_columns(p_value = 1 - chi2_cdf(col("chi2"), 8))
    .with_columns(share = col("share").round(4), benford = col("benford").round(4), lo = col("lo").round(4), hi = col("hi").round(4),
                  expected = col("expected").round(1), chi2 = col("chi2").round(2), mad = col("mad").round(4), mad_by_chance = col("mad_by_chance").round(4), p_value = col("p_value").round(3))
    .select("quantity", "digit", "n", "total", "share", "benford", "lo", "hi", "expected", "chi2", "p_value", "mad", "mad_by_chance")
    .sort("quantity", "digit")