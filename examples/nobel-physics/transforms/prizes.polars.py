data.rows("laureates")
    .filter(col("knownName").is_not_null())
    .select(name = col("knownName").struct.field("en"),
            born = col("birth").struct.field("year").cast(Int64),
            country = col("birth").struct.field("place").struct.field("country").struct.field("en"),
            gender = col("gender"),
            wikipedia = col("wikipedia").struct.field("english"),
            prize = col("nobelPrizes"))
    .explode("prize")
    .with_columns(category = col("prize").struct.field("category").struct.field("en"),
                  year = col("prize").struct.field("awardYear").cast(Int64),
                  share = col("prize").struct.field("portion"),
                  motivation = col("prize").struct.field("motivation").struct.field("en"))
    .filter(col("category") == "Physics")
    .with_columns(decade = (col("year") / 10).floor().cast(Int64) * 10,
                  age = col("year") - col("born"))
    .drop("prize", "category")
    .sort("year")