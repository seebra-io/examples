data.rows("results")
    .select("name", "net", precision = col("net_precision").struct.field("name"), status = col("status").struct.field("abbrev"))
    .with_columns(t_us = col("net").cast(Datetime).cast(Int64))
    .sort("t_us")
    .with_columns(after = col("name").shift(1), gap_h = ((col("t_us") - col("t_us").shift(1)) / 3600000000).round(2))
    .filter(col("gap_h").is_not_null())
    .sort("gap_h", descending=True)
    .with_row_index("k")
    .with_columns(gaps = len(), mean_gap_h = col("gap_h").mean().round(2), median_gap_h = col("gap_h").median().round(2),
                  cv = (col("gap_h").std() / col("gap_h").mean()).round(2))
    .with_columns(share_at_least = ((col("k") + 1) / col("gaps")).round(3),
                  exponential = (col("gap_h") / col("mean_gap_h") * -1).exp().round(4),
                  per_day = (24 / col("mean_gap_h")).round(2),
                  no_launch_in_a_day = (-24 / col("mean_gap_h")).exp().round(3))
    .select("name", "after", "net", "gap_h", "share_at_least", "exponential", "gaps", "mean_gap_h", "median_gap_h",
            "cv", "per_day", "no_launch_in_a_day", "status")