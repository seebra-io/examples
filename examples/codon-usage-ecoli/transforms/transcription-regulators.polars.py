# UniProt's reviewed E. coli K-12 entries (one row each): the b-number (the
# gene's ordered locus name, which Ensembl uses as its gene id), the gene
# name, the protein name and the protein's amino-acid sequence.
data.rows("results")
    .select(accession = col("primaryAccession"),
            gene = col("genes").list.first().struct.field("geneName").struct.field("value"),
            b = col("genes").list.first().struct.field("orderedLocusNames").list.first().struct.field("value"),
            protein = col("proteinDescription").struct.field("recommendedName").struct.field("fullName").struct.field("value"),
            aa_seq = col("sequence").struct.field("value"),
            aa_len = col("sequence").struct.field("length"))
    .with_columns(gene_set = lit("transcription regulator"))