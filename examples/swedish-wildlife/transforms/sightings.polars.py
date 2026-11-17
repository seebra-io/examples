data.rows("results")
    .select(species = when(col("species").is_null()).then(col("scientificName")).otherwise(col("species")),
            class = col("class").fill_null(lit("unknown")),
            kingdom = col("kingdom"),
            observer = col("recordedBy").fill_null(lit("unknown")),
            province = col("stateProvince"),
            date = col("eventDate").str.slice(0, 10),
            license = col("license"),
            gbif = concat_str([lit("https://www.gbif.org/occurrence/"), col("key").cast(Utf8)]))