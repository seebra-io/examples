data.rows("features")
    .select(id = col("id"), props = col("properties"), depth = col("geometry").struct.field("coordinates").list.get(2).cast(Float64))
    .with_columns(mag = col("props").struct.field("mag"), place = col("props").struct.field("place"),
                  time = col("props").struct.field("time"), url = col("props").struct.field("url"), net = col("props").struct.field("net"))
    .drop("props")
    .filter(col("depth").is_not_null())
    .sort("time")
    .with_row_index("i")