# π-stacking candidates: the centroid of each aromatic side chain (Phe, Tyr:
# the benzene ring; His: imidazole; Trp: all nine indole atoms) against the
# centroid of the ligand's purine (nine ring atoms), within 5.5 Å. Distance
# only: the angle between the ring planes is not checked.
data1.filter((col("res").is_in(["PHE", "TYR"]) & col("atom").is_in(["CG", "CD1", "CD2", "CE1", "CE2", "CZ"]))
             | ((col("res") == "HIS") & col("atom").is_in(["CG", "ND1", "CD2", "CE1", "NE2"]))
             | ((col("res") == "TRP") & col("atom").is_in(["CG", "CD1", "CD2", "NE1", "CE2", "CE3", "CZ2", "CZ3", "CH2"])))
    .group_by("entry", "seq", "res")
    .agg(rx = col("x").mean(), ry = col("y").mean(), rz = col("z").mean(), ring_atoms = len())
    .join(data.filter(col("ring")).group_by("ligand", "entry")
              .agg(cx = col("x").mean(), cy = col("y").mean(), cz = col("z").mean()), on="entry")
    .with_columns(d = ((col("rx") - col("cx")).pow(2) + (col("ry") - col("cy")).pow(2) + (col("rz") - col("cz")).pow(2)).sqrt().round(2))
    .filter(col("d") <= 5.5)
    .sort("ligand", "d")