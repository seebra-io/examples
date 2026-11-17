data.rows("1").select(iso3 = col("countryiso3code"), country = col("country").struct.field("value"), population = col("value").cast(Float64), pop_year = col("date"))
    .join(data1.rows("1").select(iso3 = col("countryiso3code"), land_km2 = col("value").cast(Float64)), on="iso3", how="left")
    .join(data2.rows("1").select(iso3 = col("countryiso3code"), gdp_usd = col("value").cast(Float64)), on="iso3", how="left")
    .join(data3.rows("1").select(iso3 = col("countryiso3code"), co2_mt = col("value").cast(Float64)), on="iso3", how="left")
    .join(data4.rows("1").select(iso3 = col("id"), iso2 = col("iso2Code"), region = col("region").struct.field("value")), on="iso3")
    .filter(col("region") != "Aggregates")
    .with_columns(d_pop = when(col("population") > 0).then((col("population") / ((col("population").log(10) + 1e-9).floor() * 2.302585092994046).exp() + 1e-9).floor().cast(Int64, strict=False)),
                  d_area = when(col("land_km2") > 0).then((col("land_km2") / ((col("land_km2").log(10) + 1e-9).floor() * 2.302585092994046).exp() + 1e-9).floor().cast(Int64, strict=False)),
                  d_gdp = when(col("gdp_usd") > 0).then((col("gdp_usd") / ((col("gdp_usd").log(10) + 1e-9).floor() * 2.302585092994046).exp() + 1e-9).floor().cast(Int64, strict=False)),
                  d_co2 = when(col("co2_mt") > 0).then((col("co2_mt") / ((col("co2_mt").log(10) + 1e-9).floor() * 2.302585092994046).exp() + 1e-9).floor().cast(Int64, strict=False)),
                  link = concat_str([lit("https://data.worldbank.org/country/"), col("iso2")]))
    .sort("population", descending=True)