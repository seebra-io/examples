data.with_columns(c = col("close_approach_data").list.get(0), d = col("estimated_diameter").struct.field("meters"))
    .select(name = col("name").str.replace_all("[()]", ""),
            date = col("c").struct.field("close_approach_date_full"),
            time = col("c").struct.field("epoch_date_close_approach"),
            miss_ld = col("c").struct.field("miss_distance").struct.field("lunar").cast(Float64),
            miss_km = col("c").struct.field("miss_distance").struct.field("kilometers").cast(Float64),
            speed_kms = col("c").struct.field("relative_velocity").struct.field("kilometers_per_second").cast(Float64),
            diameter_m = (col("d").struct.field("estimated_diameter_min") + col("d").struct.field("estimated_diameter_max")) / 2,
            hazardous = col("is_potentially_hazardous_asteroid"),
            h_mag = col("absolute_magnitude_h"),
            url = col("nasa_jpl_url"))
    .sort("time")