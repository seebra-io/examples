# Relative synonymous codon usage (RSCU) per gene set: a codon's count over
# the count it would have if all codons of its amino acid were used equally
# (RSCU = n * degeneracy / n of the amino acid). 1 = no preference, 0 =
# never used, 6 = the only one of six used. delta = RSCU in ribosomal
# proteins minus RSCU in regulators; preferred = the codon each amino acid
# uses most in the ribosomal proteins. Start codons and stops left out.
data.filter((col("k") > 0) & (col("aa") != "*"))
    .join(data1.select("codon", "degeneracy", aa_code = col("aa")), on="codon")
    .filter(col("aa_code") != "*")
    .group_by("gene_set", "codon", "aa_code", "degeneracy")
    .agg(n = len())
    .with_columns(n_aa = col("n").sum().over("gene_set", "aa_code"))
    .with_columns(rscu = (col("n") * col("degeneracy") / col("n_aa")).round(3))
    .group_by("codon", "aa_code", "degeneracy")
    .agg(n_rp = when(col("gene_set") == "ribosomal protein").then(col("n")).sum(),
         n_tf = when(col("gene_set") == "transcription regulator").then(col("n")).sum(),
         rscu_rp = when(col("gene_set") == "ribosomal protein").then(col("rscu")).max().fill_null(0),
         rscu_tf = when(col("gene_set") == "transcription regulator").then(col("rscu")).max().fill_null(0))
    .with_columns(delta = (col("rscu_rp") - col("rscu_tf")).round(3))
    .with_columns(preferred = (col("rscu_rp") == col("rscu_rp").max().over("aa_code")) & (col("degeneracy") > 1))
    .rename({"aa_code": "aa"})
    .sort("aa", "codon")