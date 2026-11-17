data.rows("facets.0.counts")
    .select(province = lit("Norrbotten"), species_key = col("name"), records = col("count"))