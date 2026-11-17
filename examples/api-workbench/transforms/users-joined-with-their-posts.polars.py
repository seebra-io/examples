data.join(data1, on="userId", how="full", suffix="_posts")
    .with_columns(match = when(col("userId").is_null()).then(lit("posts without a user"))
                          .when(col("posts").is_null()).then(lit("user without posts"))
                          .otherwise(lit("matched")),
                  userId = when(col("userId").is_null()).then(col("userId_posts")).otherwise(col("userId")),
                  posts = col("posts").fill_null(0))
    .drop("userId_posts")
    .sort("posts", descending=True)