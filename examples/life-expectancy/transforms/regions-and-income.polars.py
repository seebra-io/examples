data.rows("1")
    .select(iso3 = col("id"), region = col("region").struct.field("value").str.strip_chars(), income = col("incomeLevel").struct.field("value"), capital = col("capitalCity"))