# every category an API is in (not only its least crowded one): how distinct its APIs are, and how crowded it is
data.with_columns(category = col("categories").str.split(" · "))
    .explode("category")
    .sort("score_raw", descending=True)
    .group_by("category")
    .agg(apis = len(), mean_score = col("score_raw").mean(), mean_distinct = col("distinct").mean(),
         median_score = col("score_raw").median(), min_score = col("score_raw").min(), max_score = col("score_raw").max(),
         most_unique = col("title").first(), least_unique = col("title").last(),
         least_unique_nearest = col("nearest_1").last(), least_unique_similarity = col("similarity_1").last(),
         place_effect = col("place_effect").mean())
    .with_columns(root = col("category").str.split("/").list.first(),
                  mean_score = col("mean_score").round(1), mean_distinct = col("mean_distinct").round(3),
                  median_score = col("median_score").round(1), min_score = col("min_score").round(0), max_score = col("max_score").round(0),
                  place_effect = col("place_effect").round(3))
    .sort("mean_score")