# rs1815739 (ACTN3: alpha-actinin-3 null (R577X)): the genotype counts of the 1000 Genomes phase 3
# samples, per population (26), super-population (AFR, AMR, EAS, EUR, SAS)
# and ALL (2,504 people). ref: the reference allele, the first of
# Ensembl's allele string.
data.rows("population_genotypes")
    .filter(col("population").str.starts_with("1000GENOMES:phase_3:"))
    .join(data.rows("mappings").head(1).select(allele_string = col("allele_string"), chrom = col("seq_region_name"), pos = col("start")), how="cross")
    .select(rsid = lit("rs1815739"), gene = lit("ACTN3"), trait = lit("alpha-actinin-3 null (R577X)"),
            pop = col("population").str.replace("1000GENOMES:phase_3:", "", literal=True),
            genotype = col("genotype"), count = col("count").cast(Int64),
            ref = col("allele_string").str.split("/").list.first(), allele_string = col("allele_string"), chrom = col("chrom"), pos = col("pos"))