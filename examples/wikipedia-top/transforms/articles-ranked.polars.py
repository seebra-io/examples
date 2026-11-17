data.rows("items.0.articles")
    .select("article", "views")
    .filter((col("article") != "Main_Page") & ~col("article").str.contains("^(Special|Wikipedia|Portal|File|Help|Talk|User|Category|Template|Draft|Module|MediaWiki)(_talk)?:"))
    .sort("views", descending=True)
    .with_row_index("rank", offset=1)
    .with_columns(link = concat_str([lit("https://en.wikipedia.org/wiki/"), col("article")]),
                  article = col("article").str.replace_all("_", " ", literal=True))