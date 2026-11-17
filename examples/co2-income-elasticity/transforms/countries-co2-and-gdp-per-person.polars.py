data.rows("1").select(iso3 = col("countryiso3code"), co2_t = col("value").cast(Float64), co2_year = col("date"))
    .join(data1.rows("1").select(iso3 = col("countryiso3code"), gdp_ppp = col("value").cast(Float64), gdp_year = col("date")), on="iso3")
    .join(data2.rows("1").select(iso3 = col("id"), iso2 = col("iso2Code"), country = col("name"),
                                 region = col("region").struct.field("value"), income = col("incomeLevel").struct.field("value")), on="iso3")
    .join(data3.rows("1").select(iso3 = col("countryiso3code"), population = col("value").cast(Float64)), on="iso3")
    # economies under a million people are left out: their inventories are dominated by artefacts
    # (fuel sold to ships and planes counted at home: Palau 83 t per person; Micronesia 0.002 t)
    .filter((col("region") != "Aggregates") & (col("co2_t") > 0) & (col("gdp_ppp") > 0) & (col("population") >= 1000000))
    .with_columns(ln_co2 = col("co2_t").log(), ln_gdp = col("gdp_ppp").log(),
                  link = concat_str([lit("https://data.worldbank.org/country/"), col("iso2")]))