data.rows("1")
    .filter(col("value").is_not_null())
    .select(iso3 = col("countryiso3code"), gdp_year = col("date").cast(Int64), gdp = col("value").round(0))