data.select("hours_ago", a = col("symbol"), cap_a = col("market_cap"), x = col("log_return"))
    .join(data.select("hours_ago", b = col("symbol"), cap_b = col("market_cap"), y = col("log_return")), on="hours_ago")
    .group_by("a", "b")
    .agg(hours = len(), cap_a = col("cap_a").first(), cap_b = col("cap_b").first(),
         r = ((col("x") - col("x").mean()) * (col("y") - col("y").mean())).sum()
             / ((col("x") - col("x").mean()).pow(2).sum() * (col("y") - col("y").mean()).pow(2).sum()).sqrt())
    .with_columns(r = col("r").round(3))
    .sort("cap_a", "cap_b", descending=True)