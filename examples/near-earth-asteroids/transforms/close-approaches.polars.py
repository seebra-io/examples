data.with_columns(c = col("close_approach_data").list.get(0), d = col("estimated_diameter").struct.field("meters"))
    .select(name = col("name").str.replace_all("[()]", ""),
            time = (col("c").struct.field("epoch_date_close_approach") * 1000).cast(Datetime).dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
            miss_ld = col("c").struct.field("miss_distance").struct.field("lunar").cast(Float64).round(2),
            miss_km = col("c").struct.field("miss_distance").struct.field("kilometers").cast(Float64).round(0),
            speed_kms = col("c").struct.field("relative_velocity").struct.field("kilometers_per_second").cast(Float64).round(1),
            d_min_m = col("d").struct.field("estimated_diameter_min").round(0),
            d_max_m = col("d").struct.field("estimated_diameter_max").round(0),
            magnitude_h = col("absolute_magnitude_h"),
            hazardous = col("is_potentially_hazardous_asteroid"),
            sentry = col("is_sentry_object"),
            url = col("nasa_jpl_url"))
    .with_columns(size_m = ((col("d_min_m") + col("d_max_m")) / 2).round(0))
    .sort("time")