data.group_by("group")
    .agg(asteroids = len(), a_median = col("a").median().round(3), a_min = col("a").min().round(3), a_max = col("a").max().round(3),
         e_median = col("e").median().round(3), i_median = col("i").median().round(1))
    .sort("asteroids", descending = True)