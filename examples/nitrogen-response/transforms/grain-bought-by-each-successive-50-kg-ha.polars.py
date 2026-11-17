# grain gained by each successive 50 kg/ha of fertiliser on the fitted curve
data.rows("1").with_row_index("k").filter(col("k") < 16).select(lo = col("k").cast(Float64) * 50)
    .with_columns(hi = col("lo") + 50)
    .join(data1.select("c", "A_kg_ha"), how="cross")
    .with_columns(gain_kg_ha = (col("A_kg_ha") * ((-col("c") * col("lo")).exp() - (-col("c") * col("hi")).exp())).round(0))
    .with_columns(per_kg = (col("gain_kg_ha") / 50).round(2),
                  share_of_total = (col("gain_kg_ha") / col("gain_kg_ha").sum()).round(3),
                  band = concat_str([col("lo").cast(Int64).cast(String), lit("-"), col("hi").cast(Int64).cast(String), lit(" kg/ha")]))
    .select("band", "lo", "hi", "gain_kg_ha", "per_kg", "share_of_total")