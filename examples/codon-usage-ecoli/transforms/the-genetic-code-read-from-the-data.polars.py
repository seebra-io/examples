# The genetic code as the data spells it: for each of the 64 codons, the
# amino acid it stands opposite most often (start codons left out: a GTG or
# TTG start is read as Met), how often (agreement: 1 means every time), and
# how many codons share that amino acid (its degeneracy: 1 for Met and Trp,
# 6 for Leu, Ser and Arg). Disagreements are where the two databases differ
# (a frameshift, a different start, selenocysteine), not where the code does.
data.filter(col("k") > 0)
    .group_by("codon", "aa", "b1", "b2", "b3")
    .agg(n = len())
    .with_columns(total = col("n").sum().over("codon"))
    .filter(col("n") == col("n").max().over("codon"))
    .unique(subset=["codon"], keep="first", maintain_order=True)
    .with_columns(agreement = (col("n") / col("total")).round(4),
                  degeneracy = col("codon").n_unique().over("aa"),
                  gc3 = col("b3").is_in(["G", "C"]))
    .select("codon", "aa", "degeneracy", "n", "total", "agreement", "b1", "b2", "b3", "gc3")
    .sort("b1", "b2", "b3")