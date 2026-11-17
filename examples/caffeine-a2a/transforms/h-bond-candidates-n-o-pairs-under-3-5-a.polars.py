# Hydrogen-bond candidates: polar pairs (N or O on both sides) under 3.5 Å,
# the shortest one per ligand and residue, with both atoms' coordinates for
# the dashed line in 3D. Hydrogens are not in the crystal structures, so
# donor and acceptor are not checked: a candidate, not a proven bond.
data.filter((col("pair") == "polar") & (col("d") < 3.5))
    .filter(col("d") == col("d").min().over("ligand", "seq"))
    .select("ligand", "entry", "seq", "res", "patom", "latom", "part", "d", "px", "py", "pz", "lx", "ly", "lz")
    .sort("ligand", "seq")