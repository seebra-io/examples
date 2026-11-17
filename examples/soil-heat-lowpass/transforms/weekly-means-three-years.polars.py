# three years in weekly means (the daily cycle averaged away), every layer
data.with_columns(week = col("h") // 168)
    .group_by("layer", "k", "week")
    .agg(time = col("time").first(), temp_c = col("temp_c").mean().round(2), hours = len())
    .filter(col("hours") == 168)
    .sort("k", "week")