# Per genome: size in Mb, protein-coding genes per Mb (gene density), and
# the logs for the allometric fit genes = a · size^b. A link to the
# assembly at NCBI. Genomes without a protein-coding count are dropped.
data.filter(col("protein_coding") > 0)
    .with_columns(genome_mb = (col("genome_bp") / 1e6).round(3),
                  genes_per_mb = (col("protein_coding") / (col("genome_bp") / 1e6)).round(1),
                  log_size = (col("genome_bp") / 1e6).log(10), log_genes = col("protein_coding").log(10),
                  link = concat_str([lit("https://www.ncbi.nlm.nih.gov/datasets/genome/"), col("accession"), lit("/")]))
    .unique(subset=["accession"], keep="first", maintain_order=True)