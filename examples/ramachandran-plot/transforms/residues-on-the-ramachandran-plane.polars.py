# Each residue placed on the Ramachandran plane: the region of its (φ, ψ)
# (boxes around the classic basins; α_R right-handed helix, β sheet and
# extended, PPII polyproline II, α_L left-handed helix, else "other"), its
# kind (glycine and proline have their own plots: glycine has no side chain
# and goes where others can't, proline's ring pins φ near −65°), and a
# 10° × 10° cell of the plane for the occupancy count.
data.with_columns(kind = when(col("res") == "GLY").then(lit("glycine")).when(col("res") == "PRO").then(lit("proline")).otherwise(lit("other 18 amino acids")),
                  region = when(col("phi").is_between(-160, -20) & col("psi").is_between(-120, 50)).then(lit("α_R (right-handed helix)"))
                           .when(col("phi").is_between(-180, -90) & ((col("psi") >= 50) | (col("psi") <= -150))).then(lit("β (sheet, extended)"))
                           .when(col("phi").is_between(-90, -20) & (col("psi") >= 50)).then(lit("PPII (polyproline II)"))
                           .when(col("phi").is_between(20, 120) & col("psi").is_between(-60, 100)).then(lit("α_L (left-handed helix)"))
                           .otherwise(lit("other")),
                  cell_phi = ((col("phi") + 180) / 10).floor().clip(0, 35) * 10 - 180,
                  cell_psi = ((col("psi") + 180) / 10).floor().clip(0, 35) * 10 - 180,
                  link = concat_str([lit("https://www.ebi.ac.uk/pdbe/entry/pdb/"), col("entry").str.to_lowercase()]))