data.rows("1")
    .filter(col("value").is_not_null())
    .select(country = col("country").struct.field("value"), year = col("date").cast(Int64), gdp = col("value").round(0))
    .sort("country", "year")