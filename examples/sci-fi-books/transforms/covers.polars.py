# a cover per work that has one
data.rows("works")
    .filter(col("cover_id").is_not_null())
    .select(url = concat_str([lit("https://covers.openlibrary.org/b/id/"), col("cover_id").cast(Utf8), lit("-M.jpg")]),
            title = col("title"))