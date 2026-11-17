-- The five groups' genomes in one table.
SELECT accession, organism, tax_id, level, genome_bp, gc_percent, protein_coding, genes_total, annotation, grp, domain FROM data
UNION ALL SELECT accession, organism, tax_id, level, genome_bp, gc_percent, protein_coding, genes_total, annotation, grp, domain FROM data1
UNION ALL SELECT accession, organism, tax_id, level, genome_bp, gc_percent, protein_coding, genes_total, annotation, grp, domain FROM data2
UNION ALL SELECT accession, organism, tax_id, level, genome_bp, gc_percent, protein_coding, genes_total, annotation, grp, domain FROM data3
UNION ALL SELECT accession, organism, tax_id, level, genome_bp, gc_percent, protein_coding, genes_total, annotation, grp, domain FROM data4