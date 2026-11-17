data.rows("items")
    .select(namespace = col("metadata").struct.field("namespace"),
            deployment = col("metadata").struct.field("name"),
            c = col("spec").struct.field("template").struct.field("spec").struct.field("containers"))
    .explode("c")
    .select("namespace", "deployment", container = col("c").struct.field("name"), image = col("c").struct.field("image"))
    .with_columns(repo = col("image").str.replace("@.*$", "").str.replace(":[^:/]*$", ""),
                  tag = when(col("image").str.contains("@")).then(lit("(digest)"))
                        .when(col("image").str.replace("^.*/", "").str.contains(":")).then(col("image").str.replace("^.*/", "").str.replace("^[^:]*:", ""))
                        .otherwise(lit("(none: latest)")))
    .with_columns(mutable = col("tag").is_in(["latest", "(none: latest)"]))