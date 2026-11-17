data.filter(col("mag") >= 5)
    .with_columns(shallow = col("depth_km") < 70)
    .sort("mag", descending=True)
    .head(25)