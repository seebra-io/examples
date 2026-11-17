# The pocket's Cα atoms in both entries, paired by residue number: the 3D view
# fits 2YDO onto 5MZP on these (least squares), since the two crystals have
# different coordinate frames (Cα 60 Å apart before the fit).
data.filter((col("atom") == "CA") & (col("entry") == "5MZP")).select("seq", "res", x = col("x"), y = col("y"), z = col("z"))
    .join(data.filter((col("atom") == "CA") & (col("entry") == "2YDO")).select("seq", x2 = col("x"), y2 = col("y"), z2 = col("z")), on="seq")
    .join(data1.select("seq"), on="seq")
    .sort("seq")