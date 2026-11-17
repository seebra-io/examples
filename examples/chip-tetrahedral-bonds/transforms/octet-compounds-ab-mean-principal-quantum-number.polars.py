# AB compounds (1:1) whose two elements bring eight valence electrons between
# them (I-VII, II-VI, III-V, IV-IV): the octet compounds. For each:
#   delta_chi: Pauling electronegativity difference, how ionic the bond is;
#   n_bar: mean principal quantum number (period) of the two atoms, how large
#          and soft they are (Mooser and Pearson's second axis);
#   coordination from the ground-state space group: 216 zincblende and 186
#   wurtzite are tetrahedral (4 neighbours), 225 rock salt octahedral (6),
#   221 CsCl cubic (8); anything else is 'other'.
data.rows("data").unnest("attributes")
    .select("id", "nsites", formula = col("chemical_formula_reduced"), sg = col("_alexandria_space_group"), gap_ev = col("_alexandria_band_gap"),
            el = col("elements"), r = col("elements_ratios"))
    .explode("el", "r")
    .join(data1.select(el = col("symbol"), valence = col("valence"), chi = col("chi"), period = col("period")), on="el", how="left")
    .group_by("id", "nsites", "formula", "sg", "gap_ev")
    .agg(r_max = col("r").max(), v_min = col("valence").min(), v_max = col("valence").max(), v_sum = col("valence").sum(),
         missing = col("valence").is_null().sum() + col("chi").is_null().sum(),
         delta_chi = col("chi").max() - col("chi").min(), n_bar = col("period").mean())
    .filter((col("r_max") == 0.5) & (col("missing") == 0) & (col("v_sum") == 8) & (col("v_min") <= 4))
    .with_columns(family = when(col("v_min") == 1).then(lit("I-VII")).when(col("v_min") == 2).then(lit("II-VI"))
                         .when(col("v_min") == 3).then(lit("III-V")).otherwise(lit("IV-IV")),
                  structure = when(col("sg") == 216).then(lit("zincblende")).when(col("sg") == 186).then(lit("wurtzite"))
                         .when(col("sg") == 225).then(lit("rock salt")).when(col("sg") == 221).then(lit("CsCl")).otherwise(lit("other")),
                  link = concat_str([lit("https://alexandria.icams.rub.de/pbe/v1/structures/"), col("id")]))
    .with_columns(coordination = when(col("structure").is_in(["zincblende", "wurtzite"])).then(lit("tetrahedral (4)"))
                         .when(col("structure") == "rock salt").then(lit("octahedral (6)"))
                         .when(col("structure") == "CsCl").then(lit("cubic (8)")).otherwise(lit("other")),
                  delta_chi = col("delta_chi").round(2), n_bar = col("n_bar").round(2))
    .select("id", "formula", "family", "structure", "coordination", "sg", "nsites", "delta_chi", "n_bar", "gap_ev", "link")
    .sort("delta_chi")