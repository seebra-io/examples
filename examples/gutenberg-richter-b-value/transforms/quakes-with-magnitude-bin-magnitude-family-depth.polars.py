data.rows("features")
    .select(id = col("id"), props = col("properties"), coords = col("geometry").struct.field("coordinates"))
    .with_columns(mag = col("props").struct.field("mag").cast(Float64), mag_type = col("props").struct.field("magType"),
                  kind = col("props").struct.field("type"), place = col("props").struct.field("place"),
                  time = col("props").struct.field("time"), url = col("props").struct.field("url"),
                  lon = col("coords").list.get(0).cast(Float64), lat = col("coords").list.get(1).cast(Float64), depth_km = col("coords").list.get(2).cast(Float64))
    .drop("props", "coords")
    .filter((col("kind") == "earthquake") & col("mag").is_not_null())
    # magnitudes to the catalogue's 0.1 bins; energy from Gutenberg & Richter's log₁₀ E[J] = 1.5 M + 4.8
    .with_columns(m = (col("mag") * 10).round(0) / 10,
                  family = when(col("mag_type").str.starts_with("mw")).then(lit("moment magnitude Mw")).otherwise(lit("body-wave mb (and others)")),
                  depth_class = when(col("depth_km") < 70).then(lit("shallow (< 70 km)")).when(col("depth_km") < 300).then(lit("intermediate (70–300 km)")).otherwise(lit("deep (≥ 300 km)")),
                  energy_j = lit(10.0).pow(1.5 * col("mag") + 4.8))
    .sort("time")