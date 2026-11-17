# rs4988235 (LCT/MCM6: lactase persistence (-13910 C>T; A on the forward strand)): the genotype counts of the 1000 Genomes phase 3
# samples, per population (26), super-population (AFR, AMR, EAS, EUR, SAS)
# and ALL (2,504 people). ref: the reference allele, the first of
# Ensembl's allele string.
data.rows("population_genotypes")
    .filter(col("population").str.starts_with("1000GENOMES:phase_3:"))
    .join(data.rows("mappings").head(1).select(allele_string = col("allele_string"), chrom = col("seq_region_name"), pos = col("start")), how="cross")
    .select(rsid = lit("rs4988235"), gene = lit("LCT/MCM6"), trait = lit("lactase persistence (-13910 C>T; A on the forward strand)"),
            pop = col("population").str.replace("1000GENOMES:phase_3:", "", literal=True),
            genotype = col("genotype"), count = col("count").cast(Int64),
            ref = col("allele_string").str.split("/").list.first(), allele_string = col("allele_string"), chrom = col("chrom"), pos = col("pos"))