-- Per gene set: genes, the median and spread of Nc, how far below Wright's
-- mutation-only curve the genes sit, GC3s and the share of preferred codons.
SELECT gene_set, COUNT(*) AS genes, SUM(syn_codons) AS synonymous_codons,
       ROUND(MEDIAN(nc), 1) AS median_nc, ROUND(MIN(nc), 1) AS min_nc, ROUND(MAX(nc), 1) AS max_nc,
       ROUND(MEDIAN(expected), 1) AS median_expected_nc, ROUND(MEDIAN(below_expected), 1) AS median_below_expected,
       ROUND(MEDIAN(gc3s), 3) AS median_gc3s, ROUND(MEDIAN(fop), 3) AS median_fop
FROM data GROUP BY gene_set ORDER BY gene_set