# one row per station, channel and ground-motion measure (ShakeMap's station list: peak values per channel, in %g and cm/s)
data.rows("features")
    .select(station = col("id"), name = col("properties").struct.field("name"), network = col("properties").struct.field("network"),
            distance_km = col("properties").struct.field("distance"), coords = col("geometry").struct.field("coordinates"),
            channels = col("properties").struct.field("channels"))
    .explode("channels")
    .with_columns(channel = col("channels").struct.field("name"), amplitudes = col("channels").struct.field("amplitudes"))
    .explode("amplitudes")
    .with_columns(measure = col("amplitudes").struct.field("name"), value = col("amplitudes").struct.field("value").cast(Float64, strict=False),
                  flag = col("amplitudes").struct.field("flag").cast(Utf8),
                  lon = col("coords").list.get(0), lat = col("coords").list.get(1))
    .filter(~col("channel").str.ends_with("Z") & (col("flag") == "0") & col("value").is_not_null())
    .select("station", "name", "network", "distance_km", "lon", "lat", "channel", "measure", "value")