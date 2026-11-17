data.rows("facets.0.counts")
    .select(species = lit("False morel"), latin = lit("Gyromitra esculenta"), taxon_key = lit("5258510"),
            month = col("name").cast(Int64), records = col("count"))