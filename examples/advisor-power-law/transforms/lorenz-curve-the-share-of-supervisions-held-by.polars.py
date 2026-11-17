# advisors ranked from most to fewest students: cumulative share of advisors (x) against cumulative share of supervisions (y)
data.sort("k", descending=True)
    .with_columns(top_share_advisors = col("n").cum_sum() / col("n").sum(), top_share_supervisions = col("links").cum_sum() / col("links").sum())
    .select("k", "n", "links", top_share_advisors = col("top_share_advisors").round(6), top_share_supervisions = col("top_share_supervisions").round(6), link = col("link"))