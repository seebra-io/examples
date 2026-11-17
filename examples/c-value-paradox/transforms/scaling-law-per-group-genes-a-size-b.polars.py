# The scaling law per group: log10(genes) = log10(a) +
# b · log10(size), least squares. b = 1 means genes grow in proportion to
# the genome (constant density); b near 0 means the genome grows without
# adding genes. Also the range of sizes (fold) against the range of gene
# counts, and the median density.
data.group_by("grp", "domain")
    .agg(genomes = len(),
         stt = ((col("log_size") - col("log_size").mean()).pow(2)).sum(),
         sty = ((col("log_size") - col("log_size").mean()) * (col("log_genes") - col("log_genes").mean())).sum(),
         syy = ((col("log_genes") - col("log_genes").mean()).pow(2)).sum(),
         mx = col("log_size").mean(), my = col("log_genes").mean(),
         min_mb = col("genome_mb").min(), max_mb = col("genome_mb").max(),
         min_genes = col("protein_coding").min(), max_genes = col("protein_coding").max(),
         median_mb = col("genome_mb").median(), median_genes = col("protein_coding").median(), median_density = col("genes_per_mb").median())
    .with_columns(b = col("sty") / col("stt"))
    .with_columns(log_a = col("my") - col("b") * col("mx"),
                  r2 = col("sty").pow(2) / (col("stt") * col("syy")),
                  size_fold = col("max_mb") / col("min_mb"), gene_fold = col("max_genes") / col("min_genes"))
    .with_columns(b = col("b").round(3), r2 = col("r2").round(3), a = (col("log_a") * 2.302585092994046).exp().round(1),
                  size_fold = col("size_fold").round(0), gene_fold = col("gene_fold").round(1), median_density = col("median_density").round(1))
    .select(group = col("grp"), domain = col("domain"), genomes = col("genomes"), b = col("b"), a = col("a"), log_a = col("log_a"), r2 = col("r2"),
            min_mb = col("min_mb"), max_mb = col("max_mb"), size_fold = col("size_fold"),
            min_genes = col("min_genes"), max_genes = col("max_genes"), gene_fold = col("gene_fold"),
            median_mb = col("median_mb"), median_genes = col("median_genes"), median_density = col("median_density"))
    .sort("domain", "group")