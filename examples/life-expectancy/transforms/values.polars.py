data.rows("1")
    .filter(col("value").is_not_null())
    .select(iso3 = col("countryiso3code"), country = col("country").struct.field("value"), year = col("date").cast(Int64), years = col("value").round(1))