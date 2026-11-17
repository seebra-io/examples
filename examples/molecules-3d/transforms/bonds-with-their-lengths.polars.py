data.rows("PC_Compounds")
    .select(a = col("bonds").struct.field("aid1"),
            b = col("bonds").struct.field("aid2"),
            order = col("bonds").struct.field("order"))
    .explode("a", "b", "order")
    .join(data1.select(a = col("id"), sa = col("sym"), ax = col("x"), ay = col("y"), az = col("z")), on="a")
    .join(data1.select(b = col("id"), sb = col("sym"), bx = col("x"), by = col("y"), bz = col("z")), on="b")
    .with_columns(length = ((col("bx") - col("ax")).pow(2) + (col("by") - col("ay")).pow(2) + (col("bz") - col("az")).pow(2)).sqrt().round(3),
                  bond = when(col("order") == 2).then(lit("=")).otherwise(lit("–")))
    .with_columns(kind = when(col("sa") <= col("sb")).then(concat_str([col("sa"), col("bond"), col("sb")]))
                         .otherwise(concat_str([col("sb"), col("bond"), col("sa")])))
    .select("a", "b", "order", "kind", "length")
    .sort("kind")