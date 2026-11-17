data.rows("facets.0.counts")
    .select(species = lit("Funnel chanterelle"), latin = lit("Craterellus tubaeformis"), taxon_key = lit("2554536"),
            month = col("name").cast(Int64), records = col("count"))