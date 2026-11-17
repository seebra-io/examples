-- The same fit for the two domains of life pooled: prokaryotes (bacteria and
-- archaea) against eukaryotes (fungi, plants, animals).
SELECT domain, COUNT(*) AS genomes,
       ROUND((AVG(log_size * log_genes) - AVG(log_size) * AVG(log_genes)) / (AVG(log_size * log_size) - AVG(log_size) * AVG(log_size)), 3) AS b,
       ROUND(MEDIAN(genes_per_mb), 1) AS median_genes_per_mb,
       ROUND(MIN(genome_mb), 2) AS min_mb, ROUND(MAX(genome_mb), 1) AS max_mb,
       MIN(protein_coding) AS min_genes, MAX(protein_coding) AS max_genes
FROM data GROUP BY domain ORDER BY domain