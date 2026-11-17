data.with_columns(N = col("records").sum().over("province").cast(Float64))
    .with_columns(n = col("N").min(), rest = col("N") - col("records").cast(Float64))
    .with_columns(p_absent = when(col("rest") >= col("n"))
                      .then((lgamma(col("rest") + 1) - lgamma(col("rest") - col("n") + 1) - lgamma(col("N") + 1) + lgamma(col("N") - col("n") + 1)).exp())
                      .otherwise(0.0))
    .group_by("province")
    .agg(records = col("N").first(), species = len(),
         singletons = (col("records") == 1).sum(), doubletons = (col("records") == 2).sum(),
         common_n = col("n").first(), species_at_common_n = (1 - col("p_absent")).sum().round(1))
    .with_columns(f1 = col("singletons").cast(Float64), f2 = col("doubletons").cast(Float64))
    .with_columns(unseen = col("f1") * (col("f1") - 1) / (2 * (col("f2") + 1)),
                  var = col("f1") * (col("f1") - 1) / (2 * (col("f2") + 1))
                        + col("f1") * (2 * col("f1") - 1).pow(2) / (4 * (col("f2") + 1).pow(2))
                        + col("f1").pow(2) * col("f2") * (col("f1") - 1).pow(2) / (4 * (col("f2") + 1).pow(4)))
    .with_columns(K = (1.96 * (1 + col("var") / col("unseen").pow(2)).log().sqrt()).exp())
    .with_columns(chao1 = (col("species") + col("unseen")).round(0),
                  chao1_lo = (col("species") + col("unseen") / col("K")).round(0),
                  chao1_hi = (col("species") + col("unseen") * col("K")).round(0),
                  new_species_per_100_records = (100 * col("f1") / col("records")).round(2),
                  coverage = (1 - col("f1") / col("records")).round(4))
    .with_columns(share_seen = (col("species") / col("chao1")).round(3))
    .select("province", "records", "species", "singletons", "doubletons", "chao1", "chao1_lo", "chao1_hi", "share_seen",
            "new_species_per_100_records", "coverage", "common_n", "species_at_common_n")
    .sort("records", descending=True)