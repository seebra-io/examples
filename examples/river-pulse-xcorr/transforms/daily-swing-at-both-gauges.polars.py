# each UTC day's swing (highest minus lowest flow) at both gauges: how much of the daily pulse is left 141 km on
data.with_columns(day = col("time").str.slice(0, 10))
    .group_by("day")
    .agg(samples = len(), up_min = col("q_up").min(), up_max = col("q_up").max(), down_min = col("q_down").min(), down_max = col("q_down").max(),
         up_mean = col("q_up").mean(), down_mean = col("q_down").mean())
    .filter(col("samples") >= 90)
    .with_columns(up_swing = (col("up_max") - col("up_min")).round(1), down_swing = (col("down_max") - col("down_min")).round(1),
                  gained = (col("down_mean") - col("up_mean")).round(1))
    .with_columns(swing_ratio = (col("down_swing") / col("up_swing")).round(3),
                  weekday = col("day").str.to_date("%Y-%m-%d").dt.weekday())
    .select("day", "weekday", "samples", "up_swing", "down_swing", "swing_ratio", up_mean = col("up_mean").round(1), down_mean = col("down_mean").round(1), gained = col("gained"))
    .sort("day")