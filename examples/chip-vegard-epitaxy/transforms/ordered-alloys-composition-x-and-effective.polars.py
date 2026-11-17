# Ordered (In,Ga)As and (Al,Ga)As cells, kept when they are zincblende-like: half
# the atoms As and within 0.05 eV/atom of the convex hull (that drops rock-salt
# and other high-energy arrangements). x = In/(In+Ga) or Al/(Al+Ga) on the
# metal sublattice; a_eff = (8 V / atoms)^(1/3): the cubic edge with the same
# volume per atom (eight atoms in a zincblende cube).
data.rows("data").unnest("attributes")
    .with_columns(lv = col("lattice_vectors"))
    .with_columns(volume = (col("lv").list.get(0).list.get(0) * (col("lv").list.get(1).list.get(1) * col("lv").list.get(2).list.get(2) - col("lv").list.get(1).list.get(2) * col("lv").list.get(2).list.get(1))
               - col("lv").list.get(0).list.get(1) * (col("lv").list.get(1).list.get(0) * col("lv").list.get(2).list.get(2) - col("lv").list.get(1).list.get(2) * col("lv").list.get(2).list.get(0))
               + col("lv").list.get(0).list.get(2) * (col("lv").list.get(1).list.get(0) * col("lv").list.get(2).list.get(1) - col("lv").list.get(1).list.get(1) * col("lv").list.get(2).list.get(0))).abs())
    .with_columns(a_eff_A = (col("volume") * 8 / col("nsites")).pow(1 / 3))
    .select("id", "nsites", "a_eff_A", formula = col("chemical_formula_reduced"), sg = col("_alexandria_space_group"), hull_ev = col("_alexandria_hull_distance"),
            gap_ev = col("_alexandria_band_gap"), gap_direct_ev = col("_alexandria_band_gap_direct"), el = col("elements"), r = col("elements_ratios"))
    .explode("el", "r")
    .group_by("id", "nsites", "a_eff_A", "formula", "sg", "hull_ev", "gap_ev", "gap_direct_ev")
    .agg(as_frac = when(col("el") == "As").then(col("r")).otherwise(None).max(),
         ga = when(col("el") == "Ga").then(col("r")).otherwise(None).max(),
         m = when(col("el").is_in(["In", "Al"])).then(col("r")).otherwise(None).max(),
         metal = when(col("el").is_in(["In", "Al"])).then(col("el")).otherwise(None).max())
    .filter(((col("as_frac") - 0.5).abs() < 1e-6) & (col("hull_ev") < 0.05))
    .with_columns(x = col("m") / (col("m") + col("ga")),
                  system = when(col("metal") == "In").then(lit("(In,Ga)As")).otherwise(lit("(Al,Ga)As")),
                  link = concat_str([lit("https://alexandria.icams.rub.de/pbe/v1/structures/"), col("id")]))
    .select("system", "formula", "sg", "nsites", "link", x = col("x").round(4), a_A = col("a_eff_A").round(4), gap_ev = col("gap_ev").round(3),
            gap_direct_ev = col("gap_direct_ev").round(3), hull_ev = col("hull_ev").round(4))
    .sort("system", "x")