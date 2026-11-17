data.rows("data")
    .select(title = col("title"),
            artist = col("creators").list.get(0, null_on_oob=True).struct.field("description"),
            date = col("creation_date"),
            earliest = col("creation_date_earliest"),
            latest = col("creation_date_latest"),
            culture = col("culture").list.get(0, null_on_oob=True),
            technique = col("technique"),
            department = col("department"),
            collection = col("collection"),
            url = col("url"))
    .with_columns(midpoint = (col("earliest") + col("latest")) / 2, span = col("latest") - col("earliest"))