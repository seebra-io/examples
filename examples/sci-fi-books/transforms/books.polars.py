data.rows("works")
    .select(title = col("title"),
            author = col("authors").list.get(0, null_on_oob=True).struct.field("name"),
            first_published = when(col("first_publish_year") > 0).then(col("first_publish_year")),
            editions = col("edition_count"),
            readable = (col("has_fulltext") & col("public_scan")).cast(Int64),
            url = concat_str([lit("https://openlibrary.org"), col("key")]))
    .with_columns(decade = (col("first_published") / 10).floor().cast(Int64) * 10)