data.rows("hits")
    .select("title", "points", "author", "url", comments = col("num_comments"), created = col("created_at_i"), id = col("objectID"))
    .with_columns(site = when(col("url").is_null()).then(lit("news.ycombinator.com"))
                    .otherwise(col("url").str.replace("^https?://(www\\.)?", "").str.split("/").list.get(0)),
                  hours_before_newest = ((col("created").max() - col("created")) / 3600).round(1),
                  link = concat_str([lit("https://news.ycombinator.com/item?id="), col("id")]))
    .drop("created", "id")