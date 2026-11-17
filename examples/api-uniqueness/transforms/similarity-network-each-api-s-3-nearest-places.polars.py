data.filter((col("variant") == "places removed") & (col("rank") <= 3))
    .select("id", "neighbour", "rank", similarity = col("similarity").round(3))