# The inventory is as of June 2025 (BTS NTAD), so age = 2025 - year built. 5-year bands from 0-4 to 125-129 years (built 1896-2025).
data.rows("features")
    .select(year_built = col("attributes").struct.field("YEAR_BUILT_027"), rating = col("attributes").struct.field("LOWEST_RATING"),
            n = col("attributes").struct.field("n"))
    .filter((col("year_built") >= 1896) & (col("year_built") <= 2025) & col("rating").is_not_null())
    .with_columns(age = 2025 - col("year_built"))
    .with_columns(band = ((col("age") / 5).floor() * 5).cast(Int64))
    .group_by("band", "rating")
    .agg(n = col("n").sum())
    .sort("band", "rating")
    .with_columns(share = col("n") / col("n").sum().over("band"))
    # share of the band at or below this rating (the cumulative distribution within the band)
    .with_columns(at_or_below = col("share").cum_sum().over("band"))
    .with_columns(share = col("share").round(4), at_or_below = col("at_or_below").round(4),
                  built = concat_str([(2025 - col("band") - 4).cast(String), lit("–"), (2025 - col("band")).cast(String)]),
                  condition = when(col("rating") <= 4).then(lit("poor (≤4)")).when(col("rating") <= 6).then(lit("fair (5–6)")).otherwise(lit("good (≥7)")))