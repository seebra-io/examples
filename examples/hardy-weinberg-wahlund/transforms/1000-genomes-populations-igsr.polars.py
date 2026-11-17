# The 1000 Genomes populations (IGSR): name, where the samples were
# collected (latitude, longitude) and the super-population. Note that some
# were sampled away from their ancestry (CEU in Utah, GIH in Houston, ACB
# in Barbados).
data.rows("hits.hits")
    .select(pop = col("_source").struct.field("code"),
            pop_name = col("_source").struct.field("name"),
            pop_description = col("_source").struct.field("description"),
            lat = col("_source").struct.field("latitude").cast(Float64),
            lon = col("_source").struct.field("longitude").cast(Float64),
            superpop = col("_source").struct.field("superpopulation").struct.field("code"),
            superpop_name = col("_source").struct.field("superpopulation").struct.field("name"),
            colour = col("_source").struct.field("superpopulation").struct.field("display_colour"))
    .filter(col("superpop").is_in(["AFR", "AMR", "EAS", "EUR", "SAS"]))