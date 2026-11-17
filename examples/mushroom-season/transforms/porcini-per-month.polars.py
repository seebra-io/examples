data.rows("facets.0.counts")
    .select(species = lit("Porcini"), latin = lit("Boletus edulis"), taxon_key = lit("5954958"),
            month = col("name").cast(Int64), records = col("count"))