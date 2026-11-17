data.group_by("generation")
    .agg(dragons = len(), primary = (col("dragon_as") == "primary").cast(Int64).sum())
    .with_columns(new_species = when(col("generation") == 1).then(151).when(col("generation") == 2).then(100)
                      .when(col("generation") == 3).then(135).when(col("generation") == 4).then(107)
                      .when(col("generation") == 5).then(156).when(col("generation") == 6).then(72)
                      .when(col("generation") == 7).then(88).when(col("generation") == 8).then(96).otherwise(120))
    .with_columns(share_pct = (100 * col("dragons") / col("new_species")).round(1),
                  lo_pct = (100 * beta_ppf(0.025, col("dragons") + 0.5, col("new_species") - col("dragons") + 0.5)).round(1),
                  hi_pct = (100 * beta_ppf(0.975, col("dragons") + 0.5, col("new_species") - col("dragons") + 0.5)).round(1),
                  overall_pct = (100 * col("dragons").sum() / col("new_species").sum()).round(1))
    .sort("generation")