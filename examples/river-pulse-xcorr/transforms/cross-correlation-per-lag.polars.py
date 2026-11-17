# cross-correlation: Pearson r between upstream at t and downstream at t + lag, for the flows and for their changes (ramps)
data.select("i", x = col("q_up"), dx = col("dq_up"))
    .join(data1, how="cross")
    .with_columns(j = col("i") + col("lag"))
    .join(data.select(j = col("i"), y = col("q_down"), dy = col("dq_down")), on="j")
    .filter(col("dx").is_not_null() & col("dy").is_not_null())
    .group_by("lag", "lag_h")
    .agg(n = len(),
         mx = col("x").mean(), my = col("y").mean(), mxy = (col("x") * col("y")).mean(), sx = col("x").std(ddof=0), sy = col("y").std(ddof=0),
         mdx = col("dx").mean(), mdy = col("dy").mean(), mdxy = (col("dx") * col("dy")).mean(), sdx = col("dx").std(ddof=0), sdy = col("dy").std(ddof=0))
    .select("lag", "lag_h", "n",
            r_flow = ((col("mxy") - col("mx") * col("my")) / (col("sx") * col("sy"))).round(4),
            r_ramp = ((col("mdxy") - col("mdx") * col("mdy")) / (col("sdx") * col("sdy"))).round(4))
    .sort("lag")