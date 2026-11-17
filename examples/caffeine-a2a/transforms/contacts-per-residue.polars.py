# Per ligand and residue: the closest distance, the closest polar (N/O) pair and
# the closest C–C pair (Å), how many atom pairs are within 5 Å, and the closest
# pair itself (receptor atom – ligand atom) with the ligand part it touches.
data.group_by("ligand", "entry", "seq", "res", "segment", "bw")
    .agg(d_min = col("d").min(),
         polar_A = when(col("pair") == "polar").then(col("d")).min(),
         cc_A = when(col("pair") == "C–C").then(col("d")).min(),
         pairs = len())
    .join(data.filter(col("d") == col("d").min().over("ligand", "seq"))
              .sort("ligand", "seq", "patom", "latom")
              .unique(subset=["ligand", "seq"], keep="first", maintain_order=True)
              .select("ligand", "seq", "part", closest = concat_str([col("patom"), lit(" – "), col("latom")])),
          on=["ligand", "seq"])
    .sort("ligand", "seq")