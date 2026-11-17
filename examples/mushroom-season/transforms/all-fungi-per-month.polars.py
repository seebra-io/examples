data.rows("facets.0.counts")
    .select(species = lit("All fungi"), latin = lit("Fungi"), taxon_key = lit("5"),
            month = col("name").cast(Int64), records = col("count"))