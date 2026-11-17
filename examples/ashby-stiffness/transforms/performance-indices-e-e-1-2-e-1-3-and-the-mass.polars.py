data.filter(col("plausible"))
    .with_columns(rho_mgm3 = col("rho_kgm3") / 1000)
    # performance indices: the mass of a part of given stiffness falls as the index rises
    # tie or strut in tension: E/ρ (GPa per Mg/m³ = MJ/kg); beam in bending: E^½/ρ; plate or panel in bending: E^⅓/ρ
    .with_columns(tie = col("e_gpa") / col("rho_mgm3"), beam = col("e_gpa").pow(0.5) / col("rho_mgm3"),
                  panel = col("e_gpa").pow(1.0 / 3) / col("rho_mgm3"))
    .with_columns(steel_tie = when(col("item") == "http://www.wikidata.org/entity/Q11427").then(col("tie")).max(),
                  steel_beam = when(col("item") == "http://www.wikidata.org/entity/Q11427").then(col("beam")).max(),
                  steel_panel = when(col("item") == "http://www.wikidata.org/entity/Q11427").then(col("panel")).max())
    # mass of the part relative to the same part in steel (same stiffness, same shape family): steel's index over this one's
    .with_columns(mass_vs_steel_tie = col("steel_tie") / col("tie"), mass_vs_steel_beam = col("steel_beam") / col("beam"),
                  mass_vs_steel_panel = col("steel_panel") / col("panel"),
                  link = col("item"))
    .sort("panel", descending=True).with_row_index("rank_panel", offset=1)
    .sort("beam", descending=True).with_row_index("rank_beam", offset=1)
    .sort("tie", descending=True).with_row_index("rank_tie", offset=1)
    .with_columns(tie = col("tie").round(2), beam = col("beam").round(3), panel = col("panel").round(3),
                  mass_vs_steel_tie = col("mass_vs_steel_tie").round(3), mass_vs_steel_beam = col("mass_vs_steel_beam").round(3),
                  mass_vs_steel_panel = col("mass_vs_steel_panel").round(3), e_gpa = col("e_gpa").round(2), nu = col("nu").round(3),
                  k_gpa = col("k_gpa").round(2), g_gpa = col("g_gpa").round(2))
    .select("label", "class", "source", "e_gpa", "rho_kgm3", "tie", "beam", "panel", "rank_tie", "rank_beam", "rank_panel",
            "mass_vs_steel_tie", "mass_vs_steel_beam", "mass_vs_steel_panel", "k_gpa", "g_gpa", "nu", "n_values", "description", "item", "link")