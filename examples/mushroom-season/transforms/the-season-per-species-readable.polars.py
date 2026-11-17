# mean_pos is months since 1 January (0..12): about 30.4 days each.
data.with_columns(spread_months = ((-2 * col("r").log()).sqrt() * 12 / (2 * 3.14159265)).round(1),
                  mean_day = (col("mean_pos") * 30.44).round(0).cast(Int64) + 1,
                  corrected_day = (col("corrected_pos") * 30.44).round(0).cast(Int64) + 1,
                  r = col("r").round(3), corrected_r = col("corrected_r").round(3))
    .select("species", "latin", "records", "mean_day", "corrected_day", "r", "spread_months", "corrected_r", "link", "map")
    .sort("mean_day")