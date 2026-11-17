# Do both entries number the receptor the same way? Each Cα's amino acid in
# 5MZP and 2YDO against GPCRdb's wild-type sequence (UniProt numbering). The
# rows left are the positions where an entry differs: its thermostabilising
# mutations where both entries model the position, and the construct's ends
# (expression tags) where only one does. Everywhere else both match the wild
# type at the same number, so residue numbers can be joined directly.
data.filter(col("atom") == "CA")
    .group_by("seq", "wt3", "segment", "bw")
    .agg(in_5MZP = when(col("entry") == "5MZP").then(col("res")).max(),
         in_2YDO = when(col("entry") == "2YDO").then(col("res")).max())
    .with_columns(note = when(col("in_5MZP").is_not_null() & col("in_2YDO").is_not_null()).then(lit("mutation (both entries model this position)"))
                         .otherwise(lit("construct end: only one entry has it (tag)")))
    .filter((col("in_5MZP") != col("wt3")) | (col("in_2YDO") != col("wt3")))
    .rename({"wt3": "wild_type"})
    .sort("seq")