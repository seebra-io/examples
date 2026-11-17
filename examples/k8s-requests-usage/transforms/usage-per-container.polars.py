data.rows("items")
    .select(namespace = col("metadata").struct.field("namespace"),
            pod = col("metadata").struct.field("name"),
            window = col("window"),
            sampled = col("timestamp"),
            c = col("containers"))
    .explode("c")
    .select("namespace", "pod", "window", "sampled",
            container = col("c").struct.field("name"),
            cpu = col("c").struct.field("usage").struct.field("cpu"),
            memory = col("c").struct.field("usage").struct.field("memory"))
    .with_columns(cpu_used = when(col("cpu").str.ends_with("n")).then(col("cpu").str.replace("n$", "").cast(Float64, strict=False) / 1000000000)
                          .when(col("cpu").str.ends_with("u")).then(col("cpu").str.replace("u$", "").cast(Float64, strict=False) / 1000000)
                          .when(col("cpu").str.ends_with("m")).then(col("cpu").str.replace("m$", "").cast(Float64, strict=False) / 1000)
                          .otherwise(col("cpu").cast(Float64, strict=False)),
                  mem_used_mib = (when(col("memory").str.ends_with("Ki")).then(col("memory").str.replace("Ki$", "").cast(Float64, strict=False) * 1024)
                          .when(col("memory").str.ends_with("Mi")).then(col("memory").str.replace("Mi$", "").cast(Float64, strict=False) * 1048576)
                          .when(col("memory").str.ends_with("Gi")).then(col("memory").str.replace("Gi$", "").cast(Float64, strict=False) * 1073741824)
                          .when(col("memory").str.ends_with("Ti")).then(col("memory").str.replace("Ti$", "").cast(Float64, strict=False) * 1099511627776)
                          .when(col("memory").str.ends_with("k")).then(col("memory").str.replace("k$", "").cast(Float64, strict=False) * 1000)
                          .when(col("memory").str.ends_with("M")).then(col("memory").str.replace("M$", "").cast(Float64, strict=False) * 1000000)
                          .when(col("memory").str.ends_with("G")).then(col("memory").str.replace("G$", "").cast(Float64, strict=False) * 1000000000)
                          .when(col("memory").str.ends_with("T")).then(col("memory").str.replace("T$", "").cast(Float64, strict=False) * 1000000000000)
                          .otherwise(col("memory").cast(Float64, strict=False))) / 1048576)
    .drop("cpu", "memory")