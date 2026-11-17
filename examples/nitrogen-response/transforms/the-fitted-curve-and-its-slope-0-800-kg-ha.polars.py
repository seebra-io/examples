data.rows("1").with_row_index("k").filter(col("k") <= 160).select(fert_kg_ha = col("k").cast(Float64) * 5)
    .join(data1.select("c", "A_kg_ha", "Y0_kg_ha"), how="cross")
    .with_columns(e = (-col("c") * col("fert_kg_ha")).exp())
    .with_columns(yield_pred = (col("Y0_kg_ha") + col("A_kg_ha") * (1 - col("e"))).round(1),
                  mp = (col("A_kg_ha") * col("c") * col("e")).round(3))
    .select("fert_kg_ha", "yield_pred", "mp")