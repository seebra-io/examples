# Each cohort keeps its bridges and takes on the poor share that bridges 10 (20) years older have today.
# Bands older than the oldest one observed keep the oldest band's share.
data.select("band", "built", "bridges", "poor", "share_poor")
    .join(data.select(band = col("band") - 10, share_poor_10 = col("share_poor")), on="band", how="left")
    .join(data.select(band = col("band") - 20, share_poor_20 = col("share_poor")), on="band", how="left")
    .with_columns(oldest = col("share_poor").sort().last())
    .with_columns(poor_2035 = (col("bridges") * col("share_poor_10").fill_null(col("oldest"))).round(0),
                  poor_2045 = (col("bridges") * col("share_poor_20").fill_null(col("oldest"))).round(0))
    .with_columns(total_poor_2025 = col("poor").sum(), total_poor_2035 = col("poor_2035").sum(), total_poor_2045 = col("poor_2045").sum(),
                  total_bridges = col("bridges").sum())
    .with_columns(share_poor_2025 = (col("total_poor_2025") / col("total_bridges")).round(4),
                  share_poor_2035 = (col("total_poor_2035") / col("total_bridges")).round(4),
                  share_poor_2045 = (col("total_poor_2045") / col("total_bridges")).round(4),
                  # extra bridges that must leave the poor class each year, beyond today's practice, to hold today's count
                  extra_fixes_per_year_to_2035 = ((col("total_poor_2035") - col("total_poor_2025")) / 10).round(0))
    .drop("oldest")
    .sort("band")