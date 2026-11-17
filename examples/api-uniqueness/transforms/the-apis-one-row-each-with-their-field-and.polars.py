# kind "api" only: the catalog also lists example dashboards
data.rows("items")
    .filter(col("kind") == "api")
    .with_row_index("pos")
    .select("pos", "id", "title", "summary",
            categories = col("categories").list.join(" · "),
            root = col("categories").list.first().str.split("/").list.first(),
            docs = col("api").struct.field("docs"),
            base_url = col("api").struct.field("url"),
            description_chars = col("description").str.len_chars(),
            tags_n = col("tags").list.len(),
            link = concat_str([lit("https://seebra.io/explore/"), col("id")]))