data.rows("facets.0.counts")
    .select(province = lit("Skåne"), species_key = col("name"), records = col("count"))