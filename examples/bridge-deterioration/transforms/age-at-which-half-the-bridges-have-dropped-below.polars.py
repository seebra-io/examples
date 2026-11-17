# For rating r: the youngest band in which at least half the bridges are rated below r (at_or_below of r - 1 >= 0.5).
data.filter(col("at_or_below") >= 0.5)
    .group_by("rating")
    .agg(age_half_below = col("band").min())
    .with_columns(below_rating = col("rating") + 1)
    .filter(col("below_rating") <= 9)
    .sort("below_rating", descending=True)
    .with_columns(years_in_step = col("age_half_below") - col("age_half_below").shift(1).fill_null(0))
    .select("below_rating", "age_half_below", "years_in_step")