data.rows("results")
    .select(net = col("net"),
            precision = col("net_precision").struct.field("name"),
            name = when(col("mission").struct.field("name").is_null()).then(col("name")).otherwise(col("mission").struct.field("name")),
            provider = col("launch_service_provider").struct.field("name"),
            rocket = col("rocket").struct.field("configuration").struct.field("full_name"),
            status = col("status").struct.field("abbrev"),
            mission_type = col("mission").struct.field("type"),
            orbit = col("mission").struct.field("orbit").struct.field("abbrev"),
            pad = col("pad").struct.field("name"),
            location = col("pad").struct.field("location").struct.field("name"),
            country = col("pad").struct.field("country").struct.field("alpha_3_code"),
            window_h = ((col("window_end").cast(Datetime).cast(Int64) - col("window_start").cast(Datetime).cast(Int64)) / 3600000000).round(1),
            webcast = col("webcast_live"),
            url = concat_str([lit("https://ll.thespacedevs.com/2.3.0/launches/"), col("id"), lit("/")]))
    .sort("net")