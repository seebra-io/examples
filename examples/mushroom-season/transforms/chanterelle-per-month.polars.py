data.rows("facets.0.counts")
    .select(species = lit("Chanterelle"), latin = lit("Cantharellus cibarius"), taxon_key = lit("5249504"),
            month = col("name").cast(Int64), records = col("count"))