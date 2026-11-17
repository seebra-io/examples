# percentile = the share of the other APIs with a lower score (as the Python script: below / (n - 1))
data.join(data.select(other = col("score")), how="cross")
    .with_columns(lower = (col("other") < col("score")).cast(Int64))
    .group_by("id")
    .agg(below = col("lower").sum(), of = len(),
         title = col("title").first(), root = col("root").first(), categories = col("categories").first(), field = col("field").first(),
         crowd = col("crowd").first(), rarity = col("rarity").first(), distinct = col("distinct").first(),
         distinct_k3 = col("distinct_k3").first(), distinct_k10 = col("distinct_k10").first(), distinct_kept = col("distinct_kept").first(),
         score_raw = col("score").first(), score_k3 = col("score_k3").first(), score_k10 = col("score_k10").first(), score_kept = col("score_kept").first(),
         place_effect = col("place_effect").first(),
         nearest_1 = col("nearest_1").first(), nearest_1_id = col("nearest_1_id").first(), similarity_1 = col("similarity_1").first(),
         nearest_2 = col("nearest_2").first(), similarity_2 = col("similarity_2").first(),
         nearest_3 = col("nearest_3").first(), similarity_3 = col("similarity_3").first(), nearest_kept = col("nearest_kept").first(),
         summary = col("summary").first(), description_chars = col("description_chars").first(), docs = col("docs").first(), link = col("link").first(), pos = col("pos").first())
    .with_columns(score = col("score_raw").round(0).cast(Int64),
                  percentile = (100 * col("below").cast(Float64) / (col("of") - 1)).round(0).cast(Int64),
                  distinct = col("distinct").round(3), rarity = col("rarity").round(3),
                  distinct_k3 = col("distinct_k3").round(3), distinct_k10 = col("distinct_k10").round(3), distinct_kept = col("distinct_kept").round(3),
                  score_k3 = col("score_k3").round(1), score_k10 = col("score_k10").round(1), score_kept = col("score_kept").round(1),
                  place_effect = col("place_effect").round(3),
                  similarity_1 = col("similarity_1").round(3), similarity_2 = col("similarity_2").round(3), similarity_3 = col("similarity_3").round(3))
    .sort("score_raw", descending=True)