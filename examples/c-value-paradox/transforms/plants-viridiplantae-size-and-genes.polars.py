# Plants (Viridiplantae) (NCBI taxon 33090): one row per reference genome with an
# annotation: its assembly size (bp), G+C %, and the annotation's gene
# counts (protein-coding, total). NCBI's first 200 reference genomes of the
# group, in its own order: a sample, not a census.
data.rows("reports")
    .select(accession = col("accession"),
            organism = col("organism").struct.field("organism_name"),
            tax_id = col("organism").struct.field("tax_id"),
            level = col("assembly_info").struct.field("assembly_level"),
            genome_bp = col("assembly_stats").struct.field("total_sequence_length").cast(Float64),
            gc_percent = col("assembly_stats").struct.field("gc_percent").cast(Float64),
            protein_coding = col("annotation_info").struct.field("stats").struct.field("gene_counts").struct.field("protein_coding").cast(Float64),
            genes_total = col("annotation_info").struct.field("stats").struct.field("gene_counts").struct.field("total").cast(Float64),
            annotation = col("annotation_info").struct.field("provider"))
    .with_columns(grp = lit("Plants (Viridiplantae)"), domain = lit("eukaryote"))