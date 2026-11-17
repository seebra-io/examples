data.rows("pokemon")
    .select(id = col("pokemon").struct.field("url").str.split("/").list.get(6).cast(Int64),
            name = col("pokemon").struct.field("name"),
            slot = col("slot"))
    .filter(col("id") < 10000)
    .with_columns(dragon_as = when(col("slot") == 1).then(lit("primary")).otherwise(lit("secondary")),
                  generation = when(col("id") <= 151).then(1).when(col("id") <= 251).then(2).when(col("id") <= 386).then(3)
                      .when(col("id") <= 493).then(4).when(col("id") <= 649).then(5).when(col("id") <= 721).then(6)
                      .when(col("id") <= 809).then(7).when(col("id") <= 905).then(8).otherwise(9))
    .with_columns(url = concat_str([lit("https://pokeapi.co/api/v2/pokemon/"), col("id").cast(Utf8)]))
    .drop("slot")
    .sort("id")