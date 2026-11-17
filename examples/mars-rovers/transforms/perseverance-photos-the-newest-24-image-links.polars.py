# the newest 24 images, medium-sized
data.rows("images")
    .select(url = col("image_files").struct.field("medium"), sol = col("sol"))
    .head(24)