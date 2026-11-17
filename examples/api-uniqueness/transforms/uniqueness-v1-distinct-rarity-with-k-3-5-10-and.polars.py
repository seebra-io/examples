# distinct = 1 - mean cosine similarity to the k nearest; v1 is k = 5 with place names removed
data.filter(col("variant") == "places removed")
    .group_by("id")
    .agg(distinct_k3 = 1 - when(col("rank") <= 3).then(col("similarity")).otherwise(None).mean(),
         distinct = 1 - when(col("rank") <= 5).then(col("similarity")).otherwise(None).mean(),
         distinct_k10 = 1 - col("similarity").mean(),
         nearest_1 = when(col("rank") == 1).then(col("neighbour_title")).otherwise(None).max(),
         nearest_1_id = when(col("rank") == 1).then(col("neighbour")).otherwise(None).max(),
         similarity_1 = when(col("rank") == 1).then(col("similarity")).otherwise(None).max(),
         nearest_2 = when(col("rank") == 2).then(col("neighbour_title")).otherwise(None).max(),
         similarity_2 = when(col("rank") == 2).then(col("similarity")).otherwise(None).max(),
         nearest_3 = when(col("rank") == 3).then(col("neighbour_title")).otherwise(None).max(),
         similarity_3 = when(col("rank") == 3).then(col("similarity")).otherwise(None).max())
    .join(data.filter(col("variant") == "places kept")
              .group_by("id")
              .agg(distinct_kept = 1 - when(col("rank") <= 5).then(col("similarity")).otherwise(None).mean(),
                   nearest_kept = when(col("rank") == 1).then(col("neighbour_title")).otherwise(None).max()),
          on="id", how="left")
    .join(data1, on="id", how="left")
    .join(data2, on="id", how="left")
    .with_columns(score = 100 * col("distinct") * col("rarity"),
                  score_k3 = 100 * col("distinct_k3") * col("rarity"),
                  score_k10 = 100 * col("distinct_k10") * col("rarity"),
                  score_kept = 100 * col("distinct_kept") * col("rarity"),
                  # how much more alike an API looks to its neighbours once the place names are out: per-country copies
                  place_effect = col("distinct_kept") - col("distinct"))