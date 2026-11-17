# The contact fingerprint: one row per ligand and residue, with its kind (the
# first that applies: H-bond under 3.5 Å, π-stacking, hydrophobic C–C under
# 4 Å, else within 5 Å), UniProt's binding-site annotation where it has one,
# and links onward.
data.join(data1.select("ligand", "seq", stack_A = col("d")), on=["ligand", "seq"], how="left")
    .join(data2.rows("features").filter(col("type") == "Binding site")
               .select(seq = col("location").struct.field("start").struct.field("value"),
                       uniprot = concat_str([lit("binding site for "), col("ligand").struct.field("name"), lit(" (UniProt)")])),
          on="seq", how="left")
    .with_columns(kind = when(col("polar_A") < 3.5).then(lit("H-bond"))
                         .when(col("stack_A").is_not_null()).then(lit("π-stacking"))
                         .when(col("cc_A") < 4.0).then(lit("hydrophobic"))
                         .otherwise(lit("within 5 Å")),
                  label = concat_str([col("res").str.slice(0, 1), col("res").str.slice(1, 2).str.to_lowercase(), col("seq").cast(Utf8)]),
                  structure = concat_str([lit("https://www.rcsb.org/structure/"), col("entry")]),
                  link = lit("https://www.uniprot.org/uniprotkb/P29274/entry#function"))
    .select("ligand", "entry", "seq", "label", "segment", "bw", "kind", "d_min", "polar_A", "stack_A", "cc_A", "pairs",
            "closest", "part", "uniprot", "structure", "link")
    .sort("seq", "ligand")