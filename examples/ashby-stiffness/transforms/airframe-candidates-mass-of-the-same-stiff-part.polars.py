data.filter(col("label").is_in(["steel", "Aluminium 6061 T6 temper", "titanium", "magnesium", "beryllium", "white spruce wood", "black spruce wood", "AKROLOY PARA ICF 40", "Alloy 718", "high-density polyethylene", "poly(methyl methacrylate)", "aluminium oxide", "iron", "boron", "diamond", "jarrah", "Grivory GM-4H"]))
    # the K-and-G value of a material that also has a recorded E gets its own name
    .with_columns(label = when(col("source").str.starts_with("E from") & (len().over("label") > 1)).then(concat_str([col("label"), lit(" (from K, G)")])).otherwise(col("label")))
    .select("label", "class", "source", "e_gpa", "rho_kgm3", "tie", "beam", "panel", "rank_tie", "rank_panel",
            "mass_vs_steel_tie", "mass_vs_steel_beam", "mass_vs_steel_panel", "link")
    .sort("mass_vs_steel_panel")