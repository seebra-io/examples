data.rows("production_types")
    .explode("data")
    .with_row_index("k")
    .with_columns(i = col("k") - col("k").min().over("name"))
    .join(data.rows("unix_seconds").with_row_index("i"), on="i")
    .select(source = col("name"),
            time = (col("value") * 1000000).cast(Datetime).dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
            mw = col("data"))