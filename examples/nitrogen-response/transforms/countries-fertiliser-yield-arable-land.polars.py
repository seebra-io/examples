data.rows("1").select(iso3 = col("countryiso3code"), country = col("country").struct.field("value"),
                     fert_kg_ha = col("value").cast(Float64), fert_year = col("date"))
    .join(data1.rows("1").select(iso3 = col("countryiso3code"), yield_kg_ha = col("value").cast(Float64), yield_year = col("date")), on="iso3")
    .join(data2.rows("1").select(iso3 = col("countryiso3code"), arable_ha = col("value").cast(Float64)), on="iso3", how="left")
    .join(data3.rows("1").select(iso3 = col("countryiso3code"), irrigated_pct = col("value").cast(Float64), irrigated_year = col("date")), on="iso3", how="left")
    .join(data4.rows("1").select(iso3 = col("id"), iso2 = col("iso2Code"), region = col("region").struct.field("value").str.strip_chars(),
                                 income = col("incomeLevel").struct.field("value")), on="iso3")
    .filter((col("region") != "Aggregates") & (col("fert_kg_ha") > 0) & (col("yield_kg_ha") > 0))
    # fertiliser per arable hectare is distorted where arable land is tiny (city states, desert greenhouses)
    # or where most fertiliser goes on pasture and plantations (it is still divided by arable land only)
    .with_columns(in_fit = (col("arable_ha").fill_null(0) >= 200000) & (col("fert_kg_ha") <= 800),
                  why_out = when(col("arable_ha").fill_null(0) < 200000).then(lit("arable land under 200,000 ha"))
                            .when(col("fert_kg_ha") > 800).then(lit("over 800 kg/ha: fertiliser spread off arable land (pasture, plantations)"))
                            .otherwise(lit("in the fit")),
                  # partial factor productivity: kg of grain per kg of fertiliser nutrients
                  grain_per_kg_fert = (col("yield_kg_ha") / col("fert_kg_ha")).round(1),
                  arable_kha = (col("arable_ha") / 1000).round(0),
                  link = concat_str([lit("https://data.worldbank.org/country/"), col("iso2")]))
    .sort("fert_kg_ha")