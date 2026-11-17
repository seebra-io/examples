# Per family: how many materials, how many have a direct gap, the share, and
# its Wilson score interval (z = 1.96), which behaves for small n and shares
# near 0 or 1 where the normal approximation doesn't.
data.group_by("family")
    .agg(n = len(), n_direct = (col("gap_type") == "direct").sum(),
         median_gap_ev = col("gap_ev").median(), median_margin_ev = col("margin_ev").median())
    .with_columns(share = col("n_direct") / col("n"))
    .with_columns(centre = (col("share") + 1.9208 / col("n")) / (1 + 3.8416 / col("n")),
                  half = 1.96 * (col("share") * (1 - col("share")) / col("n") + 0.9604 / col("n").pow(2)).sqrt() / (1 + 3.8416 / col("n")))
    .select("family", "n", "n_direct", share = col("share").round(3), lo = (col("centre") - col("half")).round(3), hi = (col("centre") + col("half")).round(3),
            median_gap_ev = col("median_gap_ev").round(2), median_margin_ev = col("median_margin_ev").round(3))
    .sort("share", descending=True)