data.group_by("collection")
    .agg(models = len(), families = col("family").n_unique(),
         median_mb = col("mb").median().round(2), largest_mb = col("mb").max(), total_mb = col("mb").sum().round(1),
         first_added = col("added").min(), last_added = col("added").max())
    .sort("models", descending = True)