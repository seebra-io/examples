# The receptor's heavy atoms in both entries (alternate conformations: A only),
# without the BRIL fusion protein that 5MZP carries in its third intracellular
# loop (residues 1001-1106). GPCRdb adds per residue its wild-type amino acid,
# its segment (TM1-TM7, loops, H8) and its generic number (Ballesteros-Weinstein
# for helices, GPCRdb's loop numbering for ECL2: 45.52 = Phe168).
data.filter((col("record") == "ATOM") & (col("seq") < 1000) & col("alt").is_in(["", "A"]) & (col("el") != "H"))
    .join(data1.select(seq = col("sequence_number"), wt = col("amino_acid"), segment = col("protein_segment"),
                       bw = col("display_generic_number").str.split("x").list.first()), on="seq", how="left")
    .with_columns(wt3 = when(col("wt") == "A").then(lit("ALA")).when(col("wt") == "R").then(lit("ARG")).when(col("wt") == "N").then(lit("ASN"))
                        .when(col("wt") == "D").then(lit("ASP")).when(col("wt") == "C").then(lit("CYS")).when(col("wt") == "Q").then(lit("GLN"))
                        .when(col("wt") == "E").then(lit("GLU")).when(col("wt") == "G").then(lit("GLY")).when(col("wt") == "H").then(lit("HIS"))
                        .when(col("wt") == "I").then(lit("ILE")).when(col("wt") == "L").then(lit("LEU")).when(col("wt") == "K").then(lit("LYS"))
                        .when(col("wt") == "M").then(lit("MET")).when(col("wt") == "F").then(lit("PHE")).when(col("wt") == "P").then(lit("PRO"))
                        .when(col("wt") == "S").then(lit("SER")).when(col("wt") == "T").then(lit("THR")).when(col("wt") == "W").then(lit("TRP"))
                        .when(col("wt") == "Y").then(lit("TYR")).when(col("wt") == "V").then(lit("VAL")).otherwise(lit(None)))
    .select("entry", "seq", "res", "wt3", "segment", "bw", "atom", "el", "x", "y", "z", "b")