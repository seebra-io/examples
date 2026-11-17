# The two ligands' atoms: caffeine (CFF) in 5MZP, modelled in two orientations
# (altloc A, occupancy 0.55, and B, 0.45), and adenosine (ADN) in 2YDO.
# part: which piece of the molecule an atom belongs to; ring: the nine atoms
# of the purine (both ligands name them N1 ... N9 the same way).
data.filter((col("record") == "HETATM") & col("res").is_in(["CFF", "ADN"]))
    .with_columns(ligand = when(col("res") == "ADN").then(lit("adenosine"))
                           .when(col("alt") == "B").then(lit("caffeine B"))
                           .otherwise(lit("caffeine A")),
                  part = when(col("atom").str.contains("'", literal=True)).then(lit("ribose"))
                         .when((col("res") == "CFF") & col("atom").is_in(["C10", "C12", "C14"])).then(lit("methyl"))
                         .otherwise(lit("purine core")),
                  ring = col("atom").is_in(["N1", "C2", "N3", "C4", "C5", "C6", "N7", "C8", "N9"]))
    .select("ligand", "entry", "res", "serial", "atom", "alt", "occ", "el", "part", "ring", "x", "y", "z", "b")
    .sort("ligand", "serial")