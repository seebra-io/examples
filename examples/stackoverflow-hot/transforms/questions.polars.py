data.rows("items")
    .select("score", "link", "tags",
            title = col("title").str.replace_all("&quot;", "\"", literal=True).str.replace_all("&#39;", "'", literal=True)
                      .str.replace_all("&lt;", "<", literal=True).str.replace_all("&gt;", ">", literal=True).str.replace_all("&amp;", "&", literal=True),
            answers = col("answer_count"), views = col("view_count"),
            answered = col("is_answered").cast(Int64),
            age_h = ((col("last_activity_date").max() - col("creation_date")) / 3600).round(1))