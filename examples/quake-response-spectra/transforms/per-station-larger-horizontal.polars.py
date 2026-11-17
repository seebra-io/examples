# one row per station: the larger horizontal component of each measure (ShakeMap's convention), and the spectrum's shape
data.group_by("station")
    .agg(name = col("name").first(), network = col("network").first(), distance_km = col("distance_km").first(),
         lon = col("lon").first(), lat = col("lat").first(), pga = when(col("measure") == "pga").then(col("value")).otherwise(None).max(), pgv = when(col("measure") == "pgv").then(col("value")).otherwise(None).max(), psa03 = when(col("measure") == "psa03").then(col("value")).otherwise(None).max(), psa10 = when(col("measure") == "psa10").then(col("value")).otherwise(None).max(), psa30 = when(col("measure") == "psa30").then(col("value")).otherwise(None).max())
    .filter(col("pga").is_not_null() & col("psa03").is_not_null() & col("psa10").is_not_null() & col("psa30").is_not_null())
    .filter((col("pga") >= 0.02) & (col("distance_km") <= 550))
    .with_columns(amp03 = (col("psa03") / col("pga")).round(3), amp10 = (col("psa10") / col("pga")).round(3), amp30 = (col("psa30") / col("pga")).round(3),
                  long_short = (col("psa30") / col("psa03")).round(3),
                  ln_long_short = (col("psa30") / col("psa03")).log(),
                  dist_bin = when(col("distance_km") < 50).then(lit("a: 0–50 km")).when(col("distance_km") < 100).then(lit("b: 50–100 km"))
                             .when(col("distance_km") < 150).then(lit("c: 100–150 km")).when(col("distance_km") < 200).then(lit("d: 150–200 km"))
                             .when(col("distance_km") < 300).then(lit("e: 200–300 km")).when(col("distance_km") < 400).then(lit("f: 300–400 km"))
                             .otherwise(lit("g: 400–550 km")))
    .sort("distance_km")