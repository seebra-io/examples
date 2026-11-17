data.rows("1").select(iso3 = col("countryiso3code"), country = col("country").struct.field("value"), year = col("date").cast(Int64),
                     fert_kg_ha = col("value").cast(Float64))
    .join(data1.rows("1").select(iso3 = col("countryiso3code"), year = col("date").cast(Int64), yield_kg_ha = col("value").cast(Float64)), on=["iso3", "year"])
    .filter(col("fert_kg_ha").is_not_null() & col("yield_kg_ha").is_not_null() & (col("fert_kg_ha") > 0))
    .with_columns(grain_per_kg_fert = (col("yield_kg_ha") / col("fert_kg_ha")).round(1),
                  link = concat_str([lit("https://data.worldbank.org/indicator/AG.CON.FERT.ZS?locations="), col("iso3")]))
    .sort("country", "year")