data.rows("facets.0.counts")
    .select(province = col("name"), birds = col("count"))
    .join(data1.rows("facets.0.counts").select(province = col("name"), records = col("count")), on="province")
    .filter(col("records") >= 1000)
    .with_columns(share_pct = (100 * col("birds") / col("records")).round(1),
                  lo_pct = (100 * beta_ppf(0.025, col("birds") + 0.5, col("records") - col("birds") + 0.5)).round(2),
                  hi_pct = (100 * beta_ppf(0.975, col("birds") + 0.5, col("records") - col("birds") + 0.5)).round(2),
                  national_pct = (100 * col("birds").sum() / col("records").sum()).round(1))
    .sort("share_pct", descending=True)