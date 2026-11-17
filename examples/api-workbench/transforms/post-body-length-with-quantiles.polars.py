data.select("id", "userId", "title", chars = col("body").str.len_chars(), words = col("body").str.split(" ").list.len())
    .with_columns(p10 = col("chars").quantile(0.1), median = col("chars").median(), p90 = col("chars").quantile(0.9),
                  posts_of_user = len().over("userId"))