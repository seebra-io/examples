data.join(data1.select("c", "A_kg_ha", "Y0_kg_ha", "n_at_mp5"), how="cross")
    .with_columns(e = (-col("c") * col("fert_kg_ha")).exp())
    .with_columns(yield_pred = (col("Y0_kg_ha") + col("A_kg_ha") * (1 - col("e"))).round(0),
                  # the marginal product: kg of grain one more kg of fertiliser buys, on the fitted curve
                  mp = (col("A_kg_ha") * col("c") * col("e")).round(2))
    .with_columns(resid = (col("yield_kg_ha") - col("yield_pred")).round(0),
                  resid_pct = (100 * (col("yield_kg_ha") / col("yield_pred") - 1)).round(1),
                  position = when(col("mp") >= 10).then(lit("steep: 10+ kg grain per extra kg"))
                             .when(col("mp") >= 3).then(lit("bend: 3-10 kg per extra kg"))
                             .otherwise(lit("flat: under 3 kg per extra kg")))
    .select("country", "iso3", "region", "income", "fert_kg_ha", "fert_year", "yield_kg_ha", "yield_year", "yield_pred", "resid", "resid_pct",
            "mp", "position", "grain_per_kg_fert", "irrigated_pct", "arable_kha", "in_fit", "why_out", "link")
    .sort("fert_kg_ha")