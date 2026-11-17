# 1UBQ (ubiquitin, 1.8 Å: α and β): one row per residue with its backbone dihedral
# angles φ (C–N–Cα–C) and ψ (N–Cα–C–N) in degrees, as PDBe's validation
# pipeline (MolProbity) computed them from the deposited coordinates, its
# verdict (Favored / Allowed / OUTLIER), and the secondary structure PDBe
# assigns (helix or strand: the residue is inside one of the entry's helix
# or strand ranges; else loop). Chain ends have no φ or ψ and are dropped.
data.rows("1ubq.molecules")
    .explode("chains")
    .select(chain = col("chains").struct.field("struct_asym_id"), models = col("chains").struct.field("models"))
    .explode("models")
    .filter(col("models").struct.field("model_id") == 1)
    .select("chain", r = col("models").struct.field("residues"))
    .explode("r")
    .select("chain", num = col("r").struct.field("residue_number"), author_num = col("r").struct.field("author_residue_number"),
            res = col("r").struct.field("residue_name"), phi = col("r").struct.field("phi"), psi = col("r").struct.field("psi"),
            rama = col("r").struct.field("rama"), cis = col("r").struct.field("cis_peptide"))
    .filter(col("phi").is_not_null() & col("psi").is_not_null())
    .join(data1.rows("1ubq.molecules")
               .explode("chains")
               .select(chain = col("chains").struct.field("chain_id"), h = col("chains").struct.field("secondary_structure").struct.field("helices"))
               .explode("h")
               .select("chain", lo = col("h").struct.field("start").struct.field("residue_number"), hi = col("h").struct.field("end").struct.field("residue_number")),
          on="chain", how="left")
    .with_columns(in_helix = (col("num") >= col("lo")) & (col("num") <= col("hi")))
    .group_by("chain", "num", "author_num", "res", "phi", "psi", "rama", "cis")
    .agg(helix = col("in_helix").cast(Int64).max())
    .join(data1.rows("1ubq.molecules")
               .explode("chains")
               .select(chain = col("chains").struct.field("chain_id"), s = col("chains").struct.field("secondary_structure").struct.field("strands"))
               .explode("s")
               .select("chain", lo = col("s").struct.field("start").struct.field("residue_number"), hi = col("s").struct.field("end").struct.field("residue_number")),
          on="chain", how="left")
    .with_columns(in_strand = (col("num") >= col("lo")) & (col("num") <= col("hi")))
    .group_by("chain", "num", "author_num", "res", "phi", "psi", "rama", "cis", "helix")
    .agg(strand = col("in_strand").cast(Int64).max())
    .with_columns(entry = lit("1UBQ"), protein = lit("ubiquitin, 1.8 Å: α and β"),
                  ss = when(col("helix").fill_null(0) == 1).then(lit("helix")).when(col("strand").fill_null(0) == 1).then(lit("strand")).otherwise(lit("loop")))
    .select("entry", "protein", "chain", "num", "author_num", "res", "phi", "psi", "rama", "ss")
    .sort("num")