data.group_by("grp")
    .agg(issues = len(), closed = col("closed").cast(Int64).sum(), still_open = (~col("closed")).cast(Int64).sum(),
         median_of_closed_only = when(col("closed")).then(col("days")).median().round(1),
         median_counting_open_as_closed = col("days").median().round(1))
    .join(data1.filter(col("survival") <= 0.5).group_by("grp").agg(kaplan_meier_median = col("days").min().round(1)), on="grp", how="left")
    .join(data1.group_by("grp").agg(open_at_the_end = col("survival").min(), followed_up_to_days = col("days").max().round(0)), on="grp", how="left")
    .sort("issues", descending=True)