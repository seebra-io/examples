data.rows("facets.0.counts")
    .select(species = lit("Fly agaric"), latin = lit("Amanita muscaria"), taxon_key = lit("8168319"),
            month = col("name").cast(Int64), records = col("count"))