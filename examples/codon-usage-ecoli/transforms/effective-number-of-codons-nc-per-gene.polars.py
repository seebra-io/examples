# The effective number of codons (Wright 1990) per gene: per amino acid the
# homozygosity F = (n * sum(p^2) - 1) / (n - 1) of its codon shares p, F
# averaged within each degeneracy class (2, 3, 4, 6 codons), and
# Nc = 2 + 9/F2 + 1/F3 + 5/F4 + 3/F6: 20 when each amino acid uses one codon,
# 61 when all are used equally. F3 (Ile alone) falls back to the mean of F2
# and F4 when a gene has too few Ile. GC3s: the G+C share at the third
# position of synonymous codons. expected: Wright's Nc if mutation bias in
# GC alone set the codons, 2 + s + 29 / (s^2 + (1 - s)^2). Fop: the share of
# a gene's synonymous codons that are the ribosomal proteins' preferred one.
data.filter((col("k") > 0) & (col("aa") != "*"))
    .join(data1.select("codon", "degeneracy", aa_code = col("aa")), on="codon")
    .join(data2.select("codon", "preferred"), on="codon")
    .filter((col("degeneracy") > 1) & (col("aa_code") != "*"))
    .group_by("b", "gene", "gene_set", "aa_code", "degeneracy", "codon", "b3", "preferred")
    .agg(n = len())
    .with_columns(n_aa = col("n").sum().over("b", "aa_code"))
    .with_columns(p2 = (col("n") / col("n_aa")).pow(2),
                  gc_n = when(col("b3").is_in(["G", "C"])).then(col("n")).otherwise(0),
                  opt_n = when(col("preferred")).then(col("n")).otherwise(0))
    .group_by("b", "gene", "gene_set", "aa_code", "degeneracy")
    .agg(n_aa = col("n").sum(), sp2 = col("p2").sum(), gc_n = col("gc_n").sum(), opt_n = col("opt_n").sum())
    .with_columns(F = when(col("n_aa") > 1).then((col("n_aa") * col("sp2") - 1) / (col("n_aa") - 1)))
    .group_by("b", "gene", "gene_set")
    .agg(F2 = when(col("degeneracy") == 2).then(col("F")).mean(),
         F3 = when(col("degeneracy") == 3).then(col("F")).mean(),
         F4 = when(col("degeneracy") == 4).then(col("F")).mean(),
         F6 = when(col("degeneracy") == 6).then(col("F")).mean(),
         syn_codons = col("n_aa").sum(), gc3_n = col("gc_n").sum(), opt_n = col("opt_n").sum())
    .with_columns(F3 = when(col("F3") > 0).then(col("F3")).otherwise((col("F2") + col("F4")) / 2))
    .with_columns(nc = (2 + 9 / col("F2") + 1 / col("F3") + 5 / col("F4") + 3 / col("F6")).clip(20, 61),
                  gc3s = col("gc3_n") / col("syn_codons"),
                  fop = col("opt_n") / col("syn_codons"))
    .with_columns(expected = 2 + col("gc3s") + 29 / (col("gc3s").pow(2) + (1 - col("gc3s")).pow(2)))
    .with_columns(below_expected = (col("expected") - col("nc")).round(1),
                  nc = col("nc").round(1), gc3s = col("gc3s").round(3), fop = col("fop").round(3), expected = col("expected").round(1),
                  link = concat_str([lit("https://www.uniprot.org/uniprotkb?query="), col("b"), lit("+AND+organism_id:83333")]))
    .select("b", "gene", "gene_set", "syn_codons", "nc", "expected", "below_expected", "gc3s", "fop", "F2", "F3", "F4", "F6", "link")
    .sort("gene_set", "nc")