data.rows("PC_Compounds")
    .select(id = col("atoms").struct.field("aid"),
            el = col("atoms").struct.field("element"),
            x = col("coords").list.get(0).struct.field("conformers").list.get(0).struct.field("x"),
            y = col("coords").list.get(0).struct.field("conformers").list.get(0).struct.field("y"),
            z = col("coords").list.get(0).struct.field("conformers").list.get(0).struct.field("z"))
    .explode("id", "el", "x", "y", "z")
    .with_columns(sym = when(col("el") == 1).then(lit("H")).when(col("el") == 6).then(lit("C"))
                        .when(col("el") == 7).then(lit("N")).when(col("el") == 8).then(lit("O"))
                        .when(col("el") == 9).then(lit("F")).when(col("el") == 15).then(lit("P"))
                        .when(col("el") == 16).then(lit("S")).when(col("el") == 17).then(lit("Cl"))
                        .otherwise(lit("other")))