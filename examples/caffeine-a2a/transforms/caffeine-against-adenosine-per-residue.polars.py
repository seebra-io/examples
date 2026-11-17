# Caffeine (either orientation) against adenosine, per residue: each one's
# strongest contact kind and closest distance, which ligand part adenosine
# touches there, and whether the contact is shared, adenosine's only or
# caffeine's only. data1 (the receptor) says which amino acid each entry has
# at that position: the thermostabilising mutations show here.
data.with_columns(rank = when(col("kind") == "H-bond").then(lit(1)).when(col("kind") == "π-stacking").then(lit(2))
                         .when(col("kind") == "hydrophobic").then(lit(3)).otherwise(lit(4)),
                  is_caf = col("ligand").str.starts_with("caffeine"),
                  is_adn = col("ligand") == "adenosine")
    .group_by("seq", "segment", "bw")
    .agg(caffeine_A = when(col("is_caf")).then(col("d_min")).min(),
         caf_rank = when(col("is_caf")).then(col("rank")).min(),
         adenosine_A = when(col("is_adn")).then(col("d_min")).min(),
         adn_rank = when(col("is_adn")).then(col("rank")).min(),
         adenosine_part = when(col("is_adn")).then(col("part")).max(),
         uniprot = col("uniprot").max())
    .join(data1.filter(col("atom") == "CA")
               .group_by("seq")
               .agg(wt = col("wt3").first(),
                    in_5MZP = when(col("entry") == "5MZP").then(col("res")).max(),
                    in_2YDO = when(col("entry") == "2YDO").then(col("res")).max()), on="seq", how="left")
    .with_columns(caffeine = when(col("caf_rank") == 1).then(lit("H-bond")).when(col("caf_rank") == 2).then(lit("π-stacking"))
                             .when(col("caf_rank") == 3).then(lit("hydrophobic")).when(col("caf_rank") == 4).then(lit("within 5 Å")),
                  adenosine = when(col("adn_rank") == 1).then(lit("H-bond")).when(col("adn_rank") == 2).then(lit("π-stacking"))
                              .when(col("adn_rank") == 3).then(lit("hydrophobic")).when(col("adn_rank") == 4).then(lit("within 5 Å")),
                  share = when(col("caffeine_A").is_not_null() & col("adenosine_A").is_not_null()).then(lit("both"))
                          .when(col("adenosine_A").is_not_null()).then(lit("adenosine only"))
                          .otherwise(lit("caffeine only")),
                  label = concat_str([col("wt").str.slice(0, 1), col("wt").str.slice(1, 2).str.to_lowercase(), col("seq").cast(Utf8)]),
                  mutation = when(col("in_5MZP") != col("wt")).then(concat_str([lit("5MZP has "), col("in_5MZP")]))
                             .when(col("in_2YDO") != col("wt")).then(concat_str([lit("2YDO has "), col("in_2YDO")])))
    .select("seq", "label", "segment", "bw", "share", "caffeine", "caffeine_A", "adenosine", "adenosine_A", "adenosine_part",
            "uniprot", "wt", "in_5MZP", "in_2YDO", "mutation")
    .sort("seq")