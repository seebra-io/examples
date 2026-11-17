# each launch's image, once
data.rows("results")
    .select(url = col("image").struct.field("image_url"), name = col("name"))
    .filter(col("url").is_not_null())
    .unique(subset=["url"], keep="first", maintain_order=True)