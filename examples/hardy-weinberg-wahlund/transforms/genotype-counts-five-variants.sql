-- The five variants' genotype counts in one table.
SELECT rsid, gene, trait, pop, genotype, count, ref, allele_string, chrom, pos FROM data
UNION ALL SELECT rsid, gene, trait, pop, genotype, count, ref, allele_string, chrom, pos FROM data1
UNION ALL SELECT rsid, gene, trait, pop, genotype, count, ref, allele_string, chrom, pos FROM data2
UNION ALL SELECT rsid, gene, trait, pop, genotype, count, ref, allele_string, chrom, pos FROM data3
UNION ALL SELECT rsid, gene, trait, pop, genotype, count, ref, allele_string, chrom, pos FROM data4