# Every codon of every gene, beside the amino acid UniProt has at the same
# place in the protein: codon k (k = 0 is the start codon) against residue k.
# The DNA and the protein come from different databases, so pairing them is
# what reads the genetic code off the data. The stop codon has no residue
# (aa = "*").
data.select("b", "gene", "gene_set", nt = col("cds").str.split(""))
    .explode("nt")
    .with_row_index("i")
    .with_columns(k = (col("i") - col("i").min().over("b")) // 3)
    .group_by("b", "gene", "gene_set", "k")
    .agg(bases = col("nt"))
    .with_columns(codon = col("bases").list.join(""))
    .join(data.select("b", aa = col("aa_seq").str.split(""))
              .explode("aa")
              .with_row_index("j")
              .with_columns(k = col("j") - col("j").min().over("b"))
              .select("b", "k", "aa"),
          on=["b", "k"], how="left")
    .with_columns(aa = col("aa").fill_null("*"),
                  b1 = col("codon").str.slice(0, 1), b2 = col("codon").str.slice(1, 1), b3 = col("codon").str.slice(2, 1))
    .select("b", "gene", "gene_set", "k", "codon", "aa", "b1", "b2", "b3")
    .sort("b", "k")