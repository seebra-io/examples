data.rows("1").select(iso3 = col("countryiso3code"), country = col("country").struct.field("value"),
                      year = col("date").cast(Int64), co2_t = col("value").cast(Float64))
    .join(data1.rows("1").select(iso3 = col("countryiso3code"), year = col("date").cast(Int64), gdp_ppp = col("value").cast(Float64)), on=["iso3", "year"])
    .filter(col("co2_t").is_not_null() & col("gdp_ppp").is_not_null())
    .sort("country", "year")