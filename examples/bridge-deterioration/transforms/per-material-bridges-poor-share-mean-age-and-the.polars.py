data.rows("features")
    .select(kind_code = col("attributes").struct.field("STRUCTURE_KIND_043A"), rating = col("attributes").struct.field("LOWEST_RATING"), n = col("attributes").struct.field("n"))
    .filter(col("rating").is_not_null())
    .group_by("kind_code")
    .agg(bridges = col("n").sum(), poor = (col("n") * (col("rating") <= 4).cast(Int64)).sum(), mean_rating = (col("rating") * col("n")).sum() / col("n").sum())
    .join(data1.rows("features")
              .select(kind_code = col("attributes").struct.field("STRUCTURE_KIND_043A"), year_built = col("attributes").struct.field("YEAR_BUILT_027"),
                      n = col("attributes").struct.field("n"), r = col("attributes").struct.field("mean_rating").cast(Float64))
              .with_columns(age = 2025 - col("year_built"))
              .with_columns(mid = ((col("age") >= 40) & (col("age") <= 59)).cast(Int64))
              .group_by("kind_code")
              .agg(mean_age = (col("age") * col("n")).sum() / col("n").sum(),
                   rating_at_40_59 = (col("r") * col("n") * col("mid")).sum() / (col("n") * col("mid")).sum(),
                   bridges_40_59 = (col("n") * col("mid")).sum()),
          on="kind_code", how="left")
    .with_columns(material = when(col("kind_code") == "1").then(lit("concrete")).when(col("kind_code") == "2").then(lit("concrete, continuous"))
                  .when(col("kind_code") == "3").then(lit("steel")).when(col("kind_code") == "4").then(lit("steel, continuous"))
                  .when(col("kind_code") == "5").then(lit("prestressed concrete")).when(col("kind_code") == "6").then(lit("prestressed concrete, continuous"))
                  .when(col("kind_code") == "7").then(lit("timber")).when(col("kind_code") == "8").then(lit("masonry"))
                  .when(col("kind_code") == "9").then(lit("aluminium, wrought or cast iron")).otherwise(lit("other")),
                  share_poor = (col("poor") / col("bridges")).round(4), mean_rating = col("mean_rating").round(2),
                  mean_age = col("mean_age").round(1), rating_at_40_59 = col("rating_at_40_59").round(2))
    .select("material", "kind_code", "bridges", "poor", "share_poor", "mean_rating", "mean_age", "bridges_40_59", "rating_at_40_59")
    .sort("bridges", descending=True)