# Hardy–Weinberg per variant and sample. alt: any allele but the reference
# (each of these variants has one alternative allele in 1000 Genomes).
# p = frequency of alt = (2 n_alt_alt + n_het) / 2N. Under random mating
# the genotypes come in p², 2pq and q²; chi2 (1 df) compares the counts
# with that, and F = 1 − H_obs / H_exp is the heterozygote deficit (the
# inbreeding coefficient): 0 in equilibrium, > 0 too few heterozygotes,
# < 0 too many. level: a population, a super-population (5 pooled) or
# ALL (26 pooled).
data.with_columns(a1 = col("genotype").str.split("|").list.first(), a2 = col("genotype").str.split("|").list.last())
    .with_columns(alts = (col("a1") != col("ref")).cast(Int64) + (col("a2") != col("ref")).cast(Int64),
                  alt_allele = when(col("a1") != col("ref")).then(col("a1")).when(col("a2") != col("ref")).then(col("a2")))
    .group_by("rsid", "gene", "trait", "pop", "ref")
    .agg(n_ref_ref = when(col("alts") == 0).then(col("count")).sum(),
         n_het = when(col("alts") == 1).then(col("count")).sum(),
         n_alt_alt = when(col("alts") == 2).then(col("count")).sum(),
         alt = col("alt_allele").max())
    .with_columns(N = col("n_ref_ref") + col("n_het") + col("n_alt_alt"))
    .with_columns(p = (2 * col("n_alt_alt") + col("n_het")) / (2 * col("N")))
    .with_columns(q = 1 - col("p"))
    .with_columns(e_ref_ref = col("N") * col("q").pow(2), e_het = 2 * col("N") * col("p") * col("q"), e_alt_alt = col("N") * col("p").pow(2))
    .with_columns(chi2 = when(col("p") * col("q") > 0).then((col("n_ref_ref") - col("e_ref_ref")).pow(2) / col("e_ref_ref")
                                                    + (col("n_het") - col("e_het")).pow(2) / col("e_het")
                                                    + (col("n_alt_alt") - col("e_alt_alt")).pow(2) / col("e_alt_alt")),
                  F = when(col("p") * col("q") > 0).then(1 - col("n_het") / col("e_het")),
                  het_obs = col("n_het") / col("N"),
                  level = when(col("pop") == "ALL").then(lit("all 26 pooled"))
                          .when(col("pop").is_in(["AFR", "AMR", "EAS", "EUR", "SAS"])).then(lit("super-population pooled"))
                          .otherwise(lit("population")))
    .with_columns(p_value = 1 - chi2_cdf(col("chi2"), 1))
    .join(data1.select("pop", "pop_name", "pop_description", "lat", "lon", "superpop", "colour"), on="pop", how="left")
    .with_columns(superpop = when(col("level") == "super-population pooled").then(col("pop")).otherwise(col("superpop")),
                  p = col("p").round(4), het_obs = col("het_obs").round(4), e_het = col("e_het").round(1), e_alt_alt = col("e_alt_alt").round(1),
                  e_ref_ref = col("e_ref_ref").round(1), chi2 = col("chi2").round(2), F = col("F").round(3), p_value = col("p_value").round(4),
                  link = concat_str([lit("https://www.ensembl.org/Homo_sapiens/Variation/Population?v="), col("rsid")]))
    .select("rsid", "gene", "trait", "level", "pop", "pop_name", "superpop", "N", "ref", "alt", "n_ref_ref", "n_het", "n_alt_alt",
            "p", "het_obs", "e_ref_ref", "e_het", "e_alt_alt", "chi2", "p_value", "F", "lat", "lon", "pop_description", "link")
    .sort("rsid", "level", "pop")