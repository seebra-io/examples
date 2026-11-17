# per film, in release order: how many characters SWAPI lists and how many of them it can weigh and place in a species
data.explode("films")
    .join(data1.select(films = col("url"), title = col("title"), episode = col("episode_id"), release_date = col("release_date")), on="films", how="inner")
    .with_columns(weighed = col("mass").str.replace_all(",", "").cast(Float64, strict=False).is_not_null(),
                  measured = col("height").str.replace_all(",", "").cast(Float64, strict=False).is_not_null(),
                  species_listed = col("species").list.len() > 0)
    .group_by("title", "episode", "release_date")
    .agg(characters = len(), weighed = col("weighed").sum(), measured = col("measured").sum(), species_listed = col("species_listed").sum())
    .with_columns(share_weighed = (col("weighed").cast(Float64) / col("characters")).round(3),
                  year = col("release_date").str.slice(0, 4).cast(Int64),
                  trilogy = when(col("episode") <= 3).then(lit("prequels (1999–2005)")).otherwise(lit("original (1977–83)")),
                  wiki = concat_str([lit("https://starwars.fandom.com/wiki/"), col("title").str.replace_all(" ", "_")]))
    .sort("release_date")