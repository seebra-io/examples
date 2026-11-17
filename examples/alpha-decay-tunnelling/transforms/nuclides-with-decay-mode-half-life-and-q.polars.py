data.select(z = col("z").cast(Int64), n = col("n").cast(Int64), symbol = col("symbol"),
            half_life = col("half_life").cast(String), unit_hl = col("unit_hl").cast(String),
            half_life_s = col("half_life_sec").cast(Float64, strict=False),
            decay = col("decay_1").cast(String), decay_pct = col("decay_pct").cast(Float64, strict=False),
            q_alpha_kev = col("qa").cast(Float64, strict=False), binding_kev = col("binding").cast(Float64, strict=False))
    .with_columns(a = col("z") + col("n"), stable = col("half_life") == "STABLE")
    .with_columns(nuclide = concat_str([col("a").cast(String), col("symbol")]),
                  mode = when(col("stable")).then(lit("stable"))
                         .when(col("decay") == "A").then(lit("α"))
                         .when(col("decay") == "B-").then(lit("β−"))
                         .when(col("decay").is_in(["EC+B+", "EC", "B+"])).then(lit("β+ / EC"))
                         .when(col("decay") == "SF").then(lit("fission"))
                         .when(col("decay").is_in(["P", "2P"])).then(lit("p emission"))
                         .when(col("decay").is_in(["N", "2N"])).then(lit("n emission"))
                         .otherwise(lit("other")),
                  log_t = when(col("half_life_s") > 0).then(col("half_life_s").log(10)),
                  n0 = col("n").cast(Float64) - 0.5, n1 = col("n").cast(Float64) + 0.5,
                  z0 = col("z").cast(Float64) - 0.5, z1 = col("z").cast(Float64) + 0.5)
    .with_columns(link = concat_str([lit("https://nds.iaea.org/relnsd/v1/data?fields=ground_states&nuclides="), col("a").cast(String), col("symbol").str.to_lowercase()]),
                  parity = when((col("z") % 2 == 0) & (col("n") % 2 == 0)).then(lit("even–even"))
                           .when((col("z") % 2 == 1) & (col("n") % 2 == 1)).then(lit("odd–odd"))
                           .otherwise(lit("odd A")))
    .sort("z", "n")