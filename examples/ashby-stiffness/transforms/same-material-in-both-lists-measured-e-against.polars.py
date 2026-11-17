data.filter(col("plausible"))
    .select("item", "label", e_measured_gpa = col("e_gpa"), e_range_low = col("e_min_gpa"), e_range_high = col("e_max_gpa"), rho_kgm3 = col("rho_kgm3"))
    .join(data1.filter(col("plausible")).select("item", "k_gpa", "g_gpa", "nu", e_from_kg_gpa = col("e_gpa")), on="item")
    .with_columns(ratio = (col("e_from_kg_gpa") / col("e_measured_gpa")).round(3), e_from_kg_gpa = col("e_from_kg_gpa").round(1),
                  nu = col("nu").round(3), link = col("item"))
    .sort("ratio")