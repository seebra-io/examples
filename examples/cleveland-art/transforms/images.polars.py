# the web-sized image of each painting
data.rows("data")
    .filter(col("images").struct.field("web").struct.field("url").is_not_null())
    .select(url = col("images").struct.field("web").struct.field("url"), title = col("title"))