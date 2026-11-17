# What drives the score: Spearman correlations of the score with its two factors, the field's crowd and the description's length
# (a long description has more words to differ by; if length drove distinct, the score would measure writing, not APIs)
data.select("distinct", "rarity", score = col("score_raw"), crowd = col("crowd").cast(Float64),
            description_chars = col("description_chars").cast(Float64), nearest_similarity = col("similarity_1"))
    .corr(["score", "distinct", "rarity", "crowd", "description_chars", "nearest_similarity"], method="spearman")