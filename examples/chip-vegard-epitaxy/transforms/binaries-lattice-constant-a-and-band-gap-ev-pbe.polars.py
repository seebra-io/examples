# The two-atom primitive cell of the fcc lattice has a quarter of the cubic
# cell's volume, so the cubic lattice constant is a = (4 V)^(1/3), V the
# determinant of the three lattice vectors (Å³).
data.rows("data").unnest("attributes")
    .select("id", "nsites", formula = col("chemical_formula_reduced"), sg = col("_alexandria_space_group"), lv = col("lattice_vectors"),
            gap_ev = col("_alexandria_band_gap"), gap_direct_ev = col("_alexandria_band_gap_direct"), hull_ev = col("_alexandria_hull_distance"))
    .with_columns(volume = (col("lv").list.get(0).list.get(0) * (col("lv").list.get(1).list.get(1) * col("lv").list.get(2).list.get(2) - col("lv").list.get(1).list.get(2) * col("lv").list.get(2).list.get(1))
               - col("lv").list.get(0).list.get(1) * (col("lv").list.get(1).list.get(0) * col("lv").list.get(2).list.get(2) - col("lv").list.get(1).list.get(2) * col("lv").list.get(2).list.get(0))
               + col("lv").list.get(0).list.get(2) * (col("lv").list.get(1).list.get(0) * col("lv").list.get(2).list.get(1) - col("lv").list.get(1).list.get(1) * col("lv").list.get(2).list.get(0))).abs())
    .with_columns(a_A = (col("volume") * 8 / col("nsites")).pow(1 / 3))
    .with_columns(material = when(col("formula") == "AsGa").then(lit("GaAs")).when(col("formula") == "AsIn").then(lit("InAs")).otherwise(col("formula")),
                  gap_type = when(col("gap_ev") <= 0).then(lit("no gap (PBE)")).when(col("gap_direct_ev") - col("gap_ev") <= 0.005).then(lit("direct")).otherwise(lit("indirect")),
                  link = concat_str([lit("https://alexandria.icams.rub.de/pbe/v1/structures/"), col("id")]))
    .select("material", "formula", "sg", "gap_type", "link", a_A = col("a_A").round(4), gap_ev = col("gap_ev").round(3), hull_ev = col("hull_ev").round(3))
    .sort("a_A")