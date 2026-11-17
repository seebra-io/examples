# the weekly pattern as numbers: mean and swing per day type
data.group_by("day_type").agg(days = len(), mean_gw = col("mean_gw").mean().round(2), swing_gw = col("swing_gw").mean().round(2),
                               max_gw = col("max_gw").mean().round(2), min_gw = col("min_gw").mean().round(2))
    .sort("mean_gw", descending=True)