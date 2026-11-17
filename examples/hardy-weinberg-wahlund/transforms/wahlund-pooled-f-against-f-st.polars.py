# The Wahlund effect: pool populations with different allele frequencies
# and the pooled sample has too few heterozygotes, even when each
# population is in equilibrium. The deficit is predicted from the
# populations alone: F_ST = Var(p) / (p̄ (1 − p̄)), the variance of the
# populations' frequencies (weighted by their sizes) over its maximum. For
# each pooled sample (ALL, and each super-population over its own
# populations) F_observed sits beside F_ST predicted.
data.filter(col("level") == "population")
    .select("rsid", "superpop", "N", "p")
    .join(data.select(kind = col("level")).unique().filter(col("kind") != "population"), how="cross")
    .with_columns(pooled = when(col("kind") == "all 26 pooled").then(lit("ALL")).otherwise(col("superpop")))
    .group_by("rsid", "pooled")
    .agg(populations = len(), N = col("N").sum(), p_bar = (col("N") * col("p")).sum() / col("N").sum(),
         p2 = (col("N") * col("p").pow(2)).sum() / col("N").sum(),
         p_min = col("p").min(), p_max = col("p").max())
    .with_columns(var_p = col("p2") - col("p_bar").pow(2))
    .with_columns(fst = when(col("p_bar") * (1 - col("p_bar")) > 0).then(col("var_p") / (col("p_bar") * (1 - col("p_bar")))))
    .join(data.filter(col("level") != "population").select("rsid", "gene", "trait", pooled = col("pop"), F_observed = col("F"),
                                                           chi2 = col("chi2"), p_value = col("p_value"), p_pooled = col("p"), n_het = col("n_het"), e_het = col("e_het")),
          on=["rsid", "pooled"])
    .with_columns(fst = col("fst").round(3), p_bar = col("p_bar").round(4), p_min = col("p_min").round(3), p_max = col("p_max").round(3),
                  gap = (col("F_observed") - col("fst")).round(3))
    .select("rsid", "gene", "trait", "pooled", "populations", "N", "p_bar", "p_min", "p_max", "fst", "F_observed", "gap", "n_het", "e_het", "chi2", "p_value")
    .sort("rsid", "pooled")