data.rows("facets.0.counts")
    .select(province = lit("Gotland"), species_key = col("name"), records = col("count"))