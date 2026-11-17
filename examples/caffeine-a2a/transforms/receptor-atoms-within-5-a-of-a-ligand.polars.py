# Every receptor atom within 5 Å of a ligand atom, in the same entry, with the
# distance (Å) and the pair's kind: polar (N or O on both sides) or C–C.
data.select("ligand", "entry", "part", latom = col("atom"), lel = col("el"), lx = col("x"), ly = col("y"), lz = col("z"))
    .join(data1.select("entry", "seq", "res", "segment", "bw", patom = col("atom"), pel = col("el"),
                       px = col("x"), py = col("y"), pz = col("z")), on="entry")
    .with_columns(d = ((col("px") - col("lx")).pow(2) + (col("py") - col("ly")).pow(2) + (col("pz") - col("lz")).pow(2)).sqrt().round(2))
    .filter(col("d") <= 5.0)
    .with_columns(pair = when(col("pel").is_in(["N", "O"]) & col("lel").is_in(["N", "O"])).then(lit("polar"))
                         .when((col("pel") == "C") & (col("lel") == "C")).then(lit("C–C"))
                         .otherwise(lit("other")))
    .sort("ligand", "seq", "d")