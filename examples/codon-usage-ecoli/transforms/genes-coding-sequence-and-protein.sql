-- Each gene's coding sequence (Ensembl, the DNA from ATG/GTG/TTG to the stop
-- codon) with its UniProt protein and the set it belongs to. The two
-- Ensembl answers hold the 99 b-numbers the queries ask for; UniProt
-- says which set each one is in (56 ribosomal proteins, 43 regulators: the
-- first 44 in genome order, of which one, b0300, has no CDS in Ensembl).
WITH p AS (SELECT b, gene, protein, aa_seq, aa_len, gene_set FROM data
           UNION ALL SELECT b, gene, protein, aa_seq, aa_len, gene_set FROM data1),
     c AS (SELECT query AS b, seq FROM data2 UNION ALL SELECT query AS b, seq FROM data3)
SELECT p.b, p.gene, p.protein, p.gene_set, p.aa_len, LENGTH(c.seq) AS cds_nt, c.seq AS cds, p.aa_seq,
       'https://www.uniprot.org/uniprotkb?query=' || p.b || '+AND+organism_id:83333' AS link
FROM p JOIN c ON p.b = c.b
ORDER BY p.gene_set, p.b