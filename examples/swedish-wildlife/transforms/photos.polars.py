# the first photo of each sighting, medium-sized, 24 of them
data.rows("results")
    .select(key = col("key"), media = col("media"))
    .explode("media")
    .filter((col("media").struct.field("type") == "StillImage") & col("media").struct.field("identifier").is_not_null())
    .unique(subset=["key"], keep="first", maintain_order=True)
    .select(url = col("media").struct.field("identifier").str.replace("/original.", "/medium.", literal=True))
    .head(24)