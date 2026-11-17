data.rows("station")
    .explode("value")
    .filter(col("value").is_not_null())
    .with_columns(temp = col("value").struct.field("value").cast(Float64),
                  quality = col("value").struct.field("quality"),
                  ms = col("value").struct.field("date"))
    .filter(col("temp").is_not_null())
    .select(station = col("name"), temp = col("temp"),
            time = (col("ms") * 1000).cast(Datetime).dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
            quality = col("quality"), lat = col("latitude"), lon = col("longitude"),
            height_m = col("height").round(0), owner = col("owner"), key = col("key"))