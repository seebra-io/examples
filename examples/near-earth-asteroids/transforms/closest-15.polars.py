data.sort("miss_ld")
    .head(15)
    .select("name", "time", "miss_ld", "miss_km", "size_m", "d_min_m", "d_max_m", "speed_kms", "hazardous", "url")